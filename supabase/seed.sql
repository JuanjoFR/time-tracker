-- Sample data for development testing
-- Creates diverse time tracking records to test the application

INSERT INTO time_records (description, duration_in_seconds, created_at) VALUES
  ('Morning standup meeting', 900, NOW() - INTERVAL '5 hours'),
  ('Code review for authentication feature', 2700, NOW() - INTERVAL '4 hours'),
  ('Implement user dashboard components', 5400, NOW() - INTERVAL '3 hours'),
  ('Documentation updates', 1800, NOW() - INTERVAL '2 hours'),
  ('Testing and bug fixes', 3600, NOW() - INTERVAL '1 hour');

-- Verify data was inserted
SELECT 
  description, 
  duration_in_seconds, 
  created_at 
FROM time_records 
ORDER BY created_at DESC;