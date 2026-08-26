-- P-26.1
-- Associa cada Goal ao usuário único definido pela ADR-002 / P-22A.
--
-- A coluna é criada inicialmente como nullable para permitir backfill
-- de registros existentes. Depois do backfill, NOT NULL e a foreign key
-- passam a garantir a integridade do schema.

ALTER TABLE goals
    ADD COLUMN user_id BIGINT;

UPDATE goals
SET user_id = 1
WHERE user_id IS NULL;

ALTER TABLE goals
    ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE goals
    ADD CONSTRAINT goals_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES users(id);

CREATE INDEX IF NOT EXISTS idx_goals_user_id
    ON goals (user_id);