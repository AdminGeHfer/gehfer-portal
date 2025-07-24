-- PHASE 4: Fix remaining Security Definer View
-- Drop and recreate the missing dashboard stats view as Security Invoker

DROP VIEW IF EXISTS public.type_quality_dashboard_stats;
CREATE VIEW public.type_quality_dashboard_stats AS
SELECT rncs.type,
    count(*) AS count
FROM rncs
WHERE (rncs.deleted_at IS NULL)
GROUP BY rncs.type;