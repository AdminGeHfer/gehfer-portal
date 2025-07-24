-- PHASE 2: Fix Critical Security Errors and Warnings

-- Fix Security Definer Views - Convert to Security Invoker where appropriate
-- These views should enforce permissions of the querying user, not the view creator

-- Fix Function Search Paths for critical functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
AS $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, new.raw_user_meta_data->>'name', new.email);
  return new;
end;
$$;

CREATE OR REPLACE FUNCTION public.manage_rnc_fields()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
    -- Definir assigned_at para novas RNCs
    IF TG_OP = 'INSERT' THEN
        NEW.assigned_at := CURRENT_DATE;
    END IF;

    -- Lógica do status
    IF NEW.assigned_at IS NULL THEN
        NEW.status := 'not_created';
    END IF;
    IF NEW.assigned_at IS NOT NULL THEN
        NEW.status := 'pending';
    END IF;
    IF NEW.collected_at IS NOT NULL THEN
        NEW.status := 'collect';
    END IF;
    IF NEW.closed_at IS NOT NULL THEN
        NEW.status := 'concluded';
    END IF;
    IF NEW.conclusion LIKE '%rnc cancelado%' THEN
        NEW.status := 'canceled';
    ELSIF NEW.conclusion LIKE '%rnc cancelada%' THEN
        NEW.status := 'canceled';
    ELSIF NEW.conclusion LIKE '%RNC CANCELADO%' THEN
        NEW.status := 'canceled';
    ELSIF NEW.conclusion LIKE '%RNC CANCELADA%' THEN
        NEW.status := 'canceled';
    END IF;
    IF NEW.resolution LIKE '%rnc cancelado%' THEN
        NEW.status := 'canceled';
    ELSIF NEW.resolution LIKE '%rnc cancelada%' THEN
        NEW.status := 'canceled';
    ELSIF NEW.resolution LIKE '%RNC CANCELADO%' THEN
        NEW.status := 'canceled';
    ELSIF NEW.resolution LIKE '%RNC CANCELADA%' THEN
        NEW.status := 'canceled';
    END IF;

    -- Lógica do days_left
    IF NEW.status = 'pending' AND NEW.assigned_at IS NOT NULL THEN
        NEW.days_left := EXTRACT(DAY FROM (CURRENT_DATE - NEW.assigned_at))::smallint;
    ELSIF NEW.status = 'collect' AND NEW.assigned_at IS NOT NULL THEN
        NEW.days_left := EXTRACT(DAY FROM (CURRENT_DATE - NEW.assigned_at))::smallint;
    ELSIF NEW.status = 'concluded' AND NEW.closed_at IS NOT NULL THEN
        NEW.days_left := EXTRACT(DAY FROM(NEW.closed_at - NEW.assigned_at))::smallint;
    ELSE
        NEW.days_left := 0;
    END IF;

    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_days_left(p_assigned_at timestamp with time zone, p_closed_at timestamp with time zone DEFAULT NULL::timestamp with time zone)
RETURNS integer
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
    -- Return 0 for invalid/null dates
    IF p_assigned_at IS NULL THEN
        RETURN 0;
    END IF;

    -- For concluded/closed RNCs
    IF p_closed_at IS NOT NULL THEN
        RETURN EXTRACT(EPOCH FROM (p_closed_at - p_assigned_at))::INTEGER / 86400;
    END IF;

    -- For active RNCs
    RETURN EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - p_assigned_at))::INTEGER / 86400;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_workflow_status_label(status text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = 'public'
AS $$
BEGIN
  RETURN CASE status
    WHEN 'open' THEN 'Aberto'
    WHEN 'analysis' THEN 'Em Análise'
    WHEN 'resolution' THEN 'Em Resolução'
    WHEN 'solved' THEN 'Solucionado'
    WHEN 'closing' THEN 'Fechamento Financeiro'
    WHEN 'closed' THEN 'Fechado'
    ELSE status
  END;
END;
$$;

CREATE OR REPLACE FUNCTION public.workflow_status_eq(workflow_state_type, rnc_workflow_status_enum)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
SET search_path = 'public'
AS $$
BEGIN
    RETURN $1::text = $2::text;
END;
$$;