ALTER TABLE goals
    ADD COLUMN reference_date DATE;

UPDATE goals
SET reference_date = CURRENT_DATE
WHERE reference_date IS NULL;

ALTER TABLE goals
    ALTER COLUMN reference_date SET NOT NULL;