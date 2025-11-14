-- Create time_records table
-- This table stores time tracking records matching the TimeRecord domain model

CREATE TABLE time_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL CHECK (description != ''),
  duration_in_seconds INTEGER NOT NULL CHECK (duration_in_seconds > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add index on created_at for efficient sorting (most recent first)
CREATE INDEX idx_time_records_created_at ON time_records (created_at DESC);

-- Add comment for clarity
COMMENT ON TABLE time_records IS 'Stores time tracking records with descriptions and durations';
COMMENT ON COLUMN time_records.description IS 'Task or activity description (required, non-empty)';
COMMENT ON COLUMN time_records.duration_in_seconds IS 'Duration in seconds (must be positive)';
COMMENT ON COLUMN time_records.created_at IS 'When the record was created (for sorting)';