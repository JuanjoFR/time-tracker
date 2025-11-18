-- Optimize RLS policies for time_records table
-- Fix: Replace auth.uid() with (select auth.uid()) to improve performance at scale
-- This prevents re-evaluation of auth.uid() for each row
-- See: https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select

-- Drop existing policies
DROP POLICY IF EXISTS "Users can only see their own records" ON time_records;
DROP POLICY IF EXISTS "Users can only insert their own records" ON time_records;
DROP POLICY IF EXISTS "Users can only update their own records" ON time_records;
DROP POLICY IF EXISTS "Users can only delete their own records" ON time_records;

-- Recreate policies with optimized auth.uid() calls

-- Policy: Users can only SELECT their own records
CREATE POLICY "Users can only see their own records" 
ON time_records 
FOR SELECT 
TO authenticated
USING (user_id = (select auth.uid()));

-- Policy: Users can only INSERT their own records
CREATE POLICY "Users can only insert their own records" 
ON time_records 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = (select auth.uid()));

-- Policy: Users can only UPDATE their own records
CREATE POLICY "Users can only update their own records" 
ON time_records 
FOR UPDATE 
TO authenticated
USING (user_id = (select auth.uid()))
WITH CHECK (user_id = (select auth.uid()));

-- Policy: Users can only DELETE their own records
CREATE POLICY "Users can only delete their own records" 
ON time_records 
FOR DELETE 
TO authenticated
USING (user_id = (select auth.uid()));
