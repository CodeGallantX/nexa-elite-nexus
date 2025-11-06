CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
    'monthly-tax-deduction',
    '0 0 1 * *', -- Run at 00:00 on the 1st day of every month
    $$
        SELECT net.http_post(
            'http://localhost:54321/functions/v1/deduct-monthly-tax',
            '{}',
            ARRAY[jsonb_build_object('Authorization', 'Bearer ' || '_SUPABASE_SERVICE_ROLE_KEY_')],
            'application/json'
        );
    $$
);
