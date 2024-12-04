-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS public.handle_workflow_email();

-- Create the improved function with enhanced logging
CREATE OR REPLACE FUNCTION public.handle_workflow_email()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  assigned_user_email TEXT;
  assigned_user_name TEXT;
  workflow_state RECORD;
  email_template TEXT;
  processed_template TEXT;
  api_response RECORD;
BEGIN
  -- Log function entry
  RAISE LOG 'handle_workflow_email triggered for RNC #% (ID: %)', NEW.rnc_number, NEW.id;
  RAISE LOG 'Status change: % -> %', OLD.workflow_status, NEW.workflow_status;

  -- Only proceed if there's a status change
  IF OLD.workflow_status = NEW.workflow_status THEN
    RAISE LOG 'No status change detected, exiting function';
    RETURN NEW;
  END IF;

  -- Get the workflow state configuration
  SELECT ws.*, wt.name as template_name INTO workflow_state
  FROM workflow_states ws
  JOIN workflow_templates wt ON ws.workflow_id = wt.id
  WHERE ws.state_type = NEW.workflow_status
  AND wt.is_default = true;

  IF NOT FOUND THEN
    RAISE LOG 'No workflow state found for status: % in default template', NEW.workflow_status;
    RETURN NEW;
  END IF;

  RAISE LOG 'Found workflow state: %, send_email: %, assigned_to: %', 
    workflow_state.label, 
    workflow_state.send_email, 
    COALESCE(workflow_state.assigned_to::text, 'null');

  IF NOT workflow_state.send_email THEN
    RAISE LOG 'Email sending is disabled for this state';
    RETURN NEW;
  END IF;

  -- Get the assigned user's details
  SELECT email, name INTO assigned_user_email, assigned_user_name
  FROM profiles
  WHERE id = COALESCE(workflow_state.assigned_to, NEW.assigned_to);

  IF assigned_user_email IS NULL THEN
    RAISE LOG 'No email found for assigned user ID: %', 
      COALESCE(workflow_state.assigned_to::text, NEW.assigned_to::text, 'null');
    RETURN NEW;
  END IF;

  RAISE LOG 'Found assigned user: % <%>', assigned_user_name, assigned_user_email;

  -- Get and process the email template
  email_template := COALESCE(
    workflow_state.email_template,
    'Olá {nome},<br><br>A RNC #{numero_rnc} teve seu status atualizado de {status_anterior} para {status_novo}.<br><br>Acesse o sistema para mais detalhes.'
  );

  RAISE LOG 'Using email template (length: %)', length(email_template);

  -- Replace template variables
  processed_template := REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          email_template,
          '{nome}', assigned_user_name
        ),
        '{numero_rnc}', NEW.rnc_number::text
      ),
      '{status_anterior}', OLD.workflow_status::text
    ),
    '{status_novo}', NEW.workflow_status::text
  );

  RAISE LOG 'Processed template (length: %)', length(processed_template);

  -- Call the edge function to send email
  SELECT INTO api_response
    status::int,
    content::json->>'error' as error_message
  FROM net.http_post(
    url := 'https://ccrrssmexnbwmrudhggz.supabase.co/functions/v1/send-workflow-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', current_setting('request.headers')::json->>'apikey'
    ),
    body := jsonb_build_object(
      'from', 'RNC System <onboarding@resend.dev>',
      'to', ARRAY[assigned_user_email],
      'subject', format('RNC #%s - Status Atualizado', NEW.rnc_number),
      'html', processed_template
    )
  );

  IF api_response.status BETWEEN 200 AND 299 THEN
    RAISE LOG 'Email sent successfully to % for RNC #%', assigned_user_email, NEW.rnc_number;
  ELSE
    RAISE LOG 'Failed to send email. Status: %, Error: %', 
      api_response.status, 
      COALESCE(api_response.error_message, 'Unknown error');
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in handle_workflow_email: % | Stack: %', SQLERRM, pg_exception_context();
  RETURN NEW;
END;
$$;

-- Make sure the trigger is properly set up
DROP TRIGGER IF EXISTS on_workflow_status_change ON public.rncs;

CREATE TRIGGER on_workflow_status_change
  AFTER UPDATE ON public.rncs
  FOR EACH ROW
  WHEN (OLD.workflow_status IS DISTINCT FROM NEW.workflow_status)
  EXECUTE FUNCTION handle_workflow_email();