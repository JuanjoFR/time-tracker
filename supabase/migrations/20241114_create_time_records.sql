-- Create time_records table with anonymous auth support
-- This table stores time tracking records matching the TimeRecord domain model

CREATE TABLE time_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL CHECK (description != ''),
  duration_in_seconds INTEGER NOT NULL CHECK (duration_in_seconds > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Enable Row Level Security
ALTER TABLE time_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for time_records

-- Policy: Users can only SELECT their own records
CREATE POLICY "Users can only see their own records" 
ON time_records 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Policy: Users can only INSERT their own records
CREATE POLICY "Users can only insert their own records" 
ON time_records 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policy: Users can only UPDATE their own records
CREATE POLICY "Users can only update their own records" 
ON time_records 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy: Users can only DELETE their own records
CREATE POLICY "Users can only delete their own records" 
ON time_records 
FOR DELETE 
TO authenticated
USING (user_id = auth.uid());

-- Add performance indexes
CREATE INDEX idx_time_records_created_at ON time_records (created_at DESC);
CREATE INDEX idx_time_records_user_id ON time_records(user_id);
CREATE INDEX idx_time_records_user_created ON time_records(user_id, created_at DESC);

-- Add comments for clarity
COMMENT ON TABLE time_records IS 'Stores time tracking records with descriptions and durations (RLS enabled)';
COMMENT ON COLUMN time_records.description IS 'Task or activity description (required, non-empty)';
COMMENT ON COLUMN time_records.duration_in_seconds IS 'Duration in seconds (must be positive)';
COMMENT ON COLUMN time_records.created_at IS 'When the record was created (for sorting)';
COMMENT ON COLUMN time_records.user_id IS 'Reference to auth.users - RLS ensures data isolation';