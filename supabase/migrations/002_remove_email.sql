-- Remove email field from check_ins table
ALTER TABLE check_ins DROP COLUMN IF EXISTS email;