-- Optional structured issue; existing reviewed text campaigns remain valid.
ALTER TABLE campaigns ADD COLUMN issue_json TEXT;
