REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO service_role;