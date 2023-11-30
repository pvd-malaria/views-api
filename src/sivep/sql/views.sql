CREATE MATERIALIZED VIEW IF NOT EXISTS "SerieHistNotif" AS
  SELECT
    ano,
    count(*) AS count
  FROM "Sivep"
  GROUP BY ano;

CREATE MATERIALIZED VIEW IF NOT EXISTS "SerieHistGender" AS
  SELECT
    ano,
    sexo AS variable,
    COUNT(*) AS count
  FROM "Sivep"
  GROUP BY ano, sexo;

CREATE MATERIALIZED VIEW IF NOT EXISTS "SerieHistRaca" AS
  SELECT
    ano,
    raca AS variable,
    COUNT(*) AS count
  FROM "Sivep"
  GROUP BY ano, raca;

CREATE MATERIALIZED VIEW IF NOT EXISTS "SerieHistVivax" AS
  SELECT
    ano,
    vivax AS variable,
    COUNT(*) AS count
  FROM "Sivep"
  GROUP BY ano, vivax;

CREATE MATERIALIZED VIEW IF NOT EXISTS "SerieHistFalciparum" AS
  SELECT
    ano,
    falciparum AS variable,
    COUNT(*) AS count
  FROM "Sivep"
  GROUP BY ano, falciparum;
