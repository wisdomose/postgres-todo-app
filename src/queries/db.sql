-- create a database
CREATE DATABASE todo_db;

-- create a table

CREATE TABLE todo(
  todo_id SERIAL PRIMARY KEY,
  description VARCHAR(255),
  completed boolean NOT NULL DEFAULT False,
);

-- alter table to update schema
ALTER TABLE IF EXISTS todo
    ADD COLUMN completed boolean NOT NULL DEFAULT False;