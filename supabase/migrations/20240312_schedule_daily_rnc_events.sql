SELECT cron.schedule(
  'daily-rnc-events',        -- name of the cron job
  '0 11 * * *',             -- cron schedule (11:00 UTC = 8:00 BRT)
  $$
  SELECT
    net.http_post(
      url:='https://ccrrssmexnbwmrudhggz.supabase.co/functions/v1/daily-rnc-events',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}'::jsonb
    ) as request_id;
  $$
);