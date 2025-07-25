-- CRITICAL SECURITY FIXES - PHASE 2: Fix remaining Security Definer Views

-- Find and fix the remaining Security Definer Views that are causing the ERROR-level issues
-- These are likely the dashboard stats views that need to be converted to Security Invoker

-- Drop and recreate all dashboard views as Security Invoker (safer)
DROP VIEW IF EXISTS public.company_quality_dashboard_stats CASCADE;
DROP VIEW IF EXISTS public.department_quality_dashboard_stats CASCADE;
DROP VIEW IF EXISTS public.responsible_quality_dashboard_stats CASCADE;
DROP VIEW IF EXISTS public.type_quality_dashboard_stats CASCADE;

-- Recreate as Security Invoker views (default, safer option)
CREATE VIEW public.company_quality_dashboard_stats AS
SELECT rncs.company,
    count(*) AS count
FROM rncs
WHERE (rncs.deleted_at IS NULL)
GROUP BY rncs.company;

CREATE VIEW public.department_quality_dashboard_stats AS
SELECT rncs.department,
    count(*) AS count
FROM rncs
WHERE (rncs.deleted_at IS NULL)
GROUP BY rncs.department;

CREATE VIEW public.responsible_quality_dashboard_stats AS
SELECT rncs.responsible,
    count(*) AS count
FROM rncs
WHERE (rncs.deleted_at IS NULL)
GROUP BY rncs.responsible;

CREATE VIEW public.type_quality_dashboard_stats AS
SELECT rncs.type,
    count(*) AS count
FROM rncs
WHERE (rncs.deleted_at IS NULL)
GROUP BY rncs.type;

-- Add RLS policies for these views to ensure proper access control
ALTER VIEW public.company_quality_dashboard_stats SET (security_invoker = true);
ALTER VIEW public.department_quality_dashboard_stats SET (security_invoker = true);
ALTER VIEW public.responsible_quality_dashboard_stats SET (security_invoker = true);
ALTER VIEW public.type_quality_dashboard_stats SET (security_invoker = true);

-- Grant access to authenticated users for dashboard views
GRANT SELECT ON public.company_quality_dashboard_stats TO authenticated;
GRANT SELECT ON public.department_quality_dashboard_stats TO authenticated;
GRANT SELECT ON public.responsible_quality_dashboard_stats TO authenticated;
GRANT SELECT ON public.type_quality_dashboard_stats TO authenticated;