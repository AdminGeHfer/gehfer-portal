-- PHASE 3: Fix Security Definer Views - Convert to Security Invoker
-- These views should enforce permissions of the querying user, not the view creator

-- Drop and recreate dashboard views as Security Invoker (default)
DROP VIEW IF EXISTS public.company_quality_dashboard_stats;
CREATE VIEW public.company_quality_dashboard_stats AS
SELECT rncs.company,
    count(*) AS count
FROM rncs
WHERE (rncs.deleted_at IS NULL)
GROUP BY rncs.company;

DROP VIEW IF EXISTS public.department_quality_dashboard_stats;
CREATE VIEW public.department_quality_dashboard_stats AS
SELECT rncs.department,
    count(*) AS count
FROM rncs
WHERE (rncs.deleted_at IS NULL)
GROUP BY rncs.department;

DROP VIEW IF EXISTS public.responsible_quality_dashboard_stats;
CREATE VIEW public.responsible_quality_dashboard_stats AS
SELECT rncs.responsible,
    count(*) AS count
FROM rncs
WHERE (rncs.deleted_at IS NULL)
GROUP BY rncs.responsible;

-- Fix more critical function search paths
CREATE OR REPLACE FUNCTION public.create_workflow_state_notifications(p_state_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_state_type workflow_state_type;
  v_notification_template TEXT;
  v_send_notification BOOLEAN;
  v_notification_count INTEGER := 0;
  v_rnc RECORD;
BEGIN
  -- Get workflow state configuration
  SELECT 
    state_type,
    notification_template,
    send_notification
  INTO 
    v_state_type,
    v_notification_template,
    v_send_notification
  FROM workflow_states
  WHERE id = p_state_id;

  -- Only proceed if notifications are enabled
  IF NOT v_send_notification THEN
    RETURN 0;
  END IF;

  -- Find all RNCs in this state with needed fields and their latest transition
  FOR v_rnc IN (
    SELECT 
      r.id,
      r.rnc_number,
      r.created_by,
      r.workflow_status,
      p.name as nome,
      t.from_status,
      t.to_status
    FROM rncs r
    LEFT JOIN profiles p ON r.created_by = p.id
    LEFT JOIN LATERAL (
      SELECT 
        wt.from_status,
        wt.to_status
      FROM rnc_workflow_transitions wt
      WHERE wt.rnc_id = r.id
      AND wt.deleted_at IS NULL
      ORDER BY wt.created_at DESC
      LIMIT 1
    ) t ON true
    WHERE r.workflow_status::text = v_state_type::text
    AND r.deleted_at IS NULL
  ) LOOP
    -- Create notification with all variables replaced
    INSERT INTO notifications (
      user_id,
      title,
      message,
      type,
      rnc_id
    ) VALUES (
      v_rnc.created_by,
      'Atualização de Workflow',
      replace(
        replace(
          replace(
            replace(
              v_notification_template, 
              '{nome}', COALESCE(v_rnc.nome, 'Usuário')
            ),
            '{numero_rnc}', v_rnc.rnc_number::text
          ),
          '{status_anterior}', 
          COALESCE(get_workflow_status_label(v_rnc.from_status::text), 'Estado inicial')
        ),
        '{status_novo}',
        get_workflow_status_label(v_rnc.to_status::text)
      ),
      'workflow_state_update',
      v_rnc.id
    );
    
    v_notification_count := v_notification_count + 1;
  END LOOP;

  RETURN v_notification_count;
END;
$$;