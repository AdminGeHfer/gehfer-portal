-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS public.handle_workflow_email();

-- Create the improved function
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
BEGIN
  -- Only proceed if there's a status change and an assigned user
  IF OLD.workflow_status = NEW.workflow_status OR NEW.assigned_to IS NULL THEN
    RETURN NEW;
  END IF;

  -- Get the assigned user's details
  SELECT email, name INTO assigned_user_email, assigned_user_name
  FROM profiles
  WHERE id = NEW.assigned_to;

  IF assigned_user_email IS NULL THEN
    RAISE LOG 'No email found for assigned user: %', NEW.assigned_to;
    RETURN NEW;
  END IF;

  -- Get the workflow state configuration
  SELECT * INTO workflow_state
  FROM workflow_states ws
  JOIN workflow_templates wt ON ws.workflow_id = wt.id
  WHERE ws.state_type = NEW.workflow_status
  AND wt.is_default = true;

  IF NOT FOUND OR NOT workflow_state.send_email THEN
    RAISE LOG 'No email configuration found for status: %', NEW.workflow_status;
    RETURN NEW;
  END IF;

  -- Get and process the email template
  email_template := COALESCE(workflow_state.email_template, 
    'Olá {nome},<br><br>A RNC #{numero_rnc} teve seu status atualizado de {status_anterior} para {status_novo}.<br><br>Acesse o sistema para mais detalhes.');

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

  -- Call the edge function to send email
  PERFORM
    net.http_post(
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

  RAISE LOG 'Email request sent for RNC #% to %', NEW.rnc_number, assigned_user_email;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in handle_workflow_email: %', SQLERRM;
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