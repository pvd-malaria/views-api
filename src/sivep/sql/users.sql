CREATE TABLE IF NOT EXISTS "Users" (
  "id"            SERIAL NOT NULL PRIMARY KEY,
  "username"      TEXT NOT NULL UNIQUE,
  "password"      TEXT NOT NULL,
  "passwordSalt"  TEXT NOT NULL
);
