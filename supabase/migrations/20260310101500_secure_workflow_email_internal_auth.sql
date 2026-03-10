-- Align workflow email trigger with internal authentication model.
-- Removes dependency on request apikey and uses internal service credentials.

CREATE OR REPLACE FUNCTION public.handle_workflow_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  assigned_user_email TEXT;
  assigned_user_name TEXT;
  workflow_state RECORD;
  email_template TEXT;
  processed_template TEXT;
  edge_headers JSONB;
BEGIN
  -- Only proceed if there's a status change
  IF OLD.workflow_status = NEW.workflow_status THEN
    RETURN NEW;
  END IF;

  -- Get the workflow state configuration
  SELECT * INTO workflow_state
  FROM workflow_states ws
  JOIN workflow_templates wt ON ws.workflow_id = wt.id
  WHERE ws.state_type = NEW.workflow_status
    AND wt.is_default = true;

  IF NOT FOUND THEN
    RETURN NEW;
  END IF;

  IF NOT workflow_state.send_email THEN
    RETURN NEW;
  END IF;

  -- Get recipient details
  SELECT email, name INTO assigned_user_email, assigned_user_name
  FROM profiles
  WHERE id = COALESCE(workflow_state.assigned_to, NEW.assigned_to);

  IF assigned_user_email IS NULL THEN
    RETURN NEW;
  END IF;

  email_template := COALESCE(
    workflow_state.email_template,
    'Olá {nome},<br><br>A RNC #{numero_rnc} teve seu status atualizado de {status_anterior} para {status_novo}.<br><br>Acesse o sistema para mais detalhes.'
  );

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

  -- Internal auth headers for edge function:
  -- 1) Bearer service_role_key (existing secure server-side setting)
  -- 2) x-job-token (optional internal token for job-to-job auth)
  edge_headers := jsonb_strip_nulls(
    jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', CASE
        WHEN current_setting('app.settings.service_role_key', true) IS NULL
        THEN NULL
        ELSE 'Bearer ' || current_setting('app.settings.service_role_key', true)
      END,
      'x-job-token', current_setting('app.settings.internal_job_token', true)
    )
  );

  -- If both auth mechanisms are missing, skip request and log.
  IF (edge_headers ? 'Authorization') IS NOT TRUE
     AND (edge_headers ? 'x-job-token') IS NOT TRUE THEN
    RAISE LOG 'handle_workflow_email skipped: missing app.settings.service_role_key and app.settings.internal_job_token';
    RETURN NEW;
  END IF;

  PERFORM net.http_post(
    url := 'https://ccrrssmexnbwmrudhggz.supabase.co/functions/v1/send-workflow-email',
    headers := edge_headers,
    body := jsonb_build_object(
      'to', ARRAY[assigned_user_email],
      'subject', format('RNC #%s - Status Atualizado', NEW.rnc_number),
      'html', processed_template
    )
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in handle_workflow_email: %', SQLERRM;
  RETURN NEW;
END;
$$;
