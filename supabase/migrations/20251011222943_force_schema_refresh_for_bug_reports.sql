-- Force a schema refresh by notifying PostgREST
NOTIFY pgrst, 'reload schema';
