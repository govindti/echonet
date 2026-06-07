ALTER TABLE users ALTER COLUMN password TYPE text USING encode(password, 'escape');
