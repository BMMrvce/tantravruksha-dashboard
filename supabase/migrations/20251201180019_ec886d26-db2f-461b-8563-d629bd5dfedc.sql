-- Set REPLICA IDENTITY FULL for realtime to work properly
ALTER TABLE contact_submissions REPLICA IDENTITY FULL;