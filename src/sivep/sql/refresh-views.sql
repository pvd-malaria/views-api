CREATE OR REPLACE FUNCTION "RefreshAllMaterializedViews"(_schema TEXT DEFAULT '*')
RETURNS INT AS $$
  DECLARE
    r RECORD;
  BEGIN
    RAISE NOTICE 'Refreshing materialized view(s) in %', CASE WHEN _schema = '*' THEN 'all schemas' ELSE 'schema "'|| _schema || '"' END;
    IF pg_is_in_recovery() THEN
      RETURN 0;
    ELSE
      FOR r IN SELECT schemaname, matviewname FROM pg_matviews WHERE schemaname = _schema OR _schema = '*'
      LOOP
        RAISE NOTICE 'Refreshing %.%', r.schemaname, r.matviewname;
        EXECUTE 'REFRESH MATERIALIZED VIEW "' || r.schemaname || '"."' || r.matviewname || '"';
      END LOOP;
    END IF;
    RETURN 1;
  END 
$$ LANGUAGE plpgsql;
