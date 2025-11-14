-- Anonymous User Cleanup Script
-- Run this script periodically to clean up old anonymous users and their associated data
-- Recommended frequency: Weekly or monthly, depending on usage

-- WARNING: This will permanently delete anonymous users and all their data
-- Review the users to be deleted before running in production

-- Step 1: Preview users that will be deleted (run this first to review)
SELECT 
    id,
    created_at,
    is_anonymous,
    EXTRACT(EPOCH FROM (NOW() - created_at)) / 86400 AS days_old
FROM auth.users
WHERE 
    is_anonymous = true 
    AND created_at < NOW() - INTERVAL '30 days'
ORDER BY created_at ASC;

-- Step 2: Preview time records that will be deleted with the users
SELECT 
    COUNT(*) as records_to_delete,
    COUNT(DISTINCT user_id) as users_affected
FROM time_records tr
WHERE tr.user_id IN (
    SELECT id 
    FROM auth.users 
    WHERE is_anonymous = true 
    AND created_at < NOW() - INTERVAL '30 days'
);

-- Step 3: Actual cleanup (uncomment to execute)
-- IMPORTANT: Remove the block comments (/* */) to execute

/*
-- Delete time records first (foreign key constraint)
DELETE FROM time_records 
WHERE user_id IN (
    SELECT id 
    FROM auth.users 
    WHERE is_anonymous = true 
    AND created_at < NOW() - INTERVAL '30 days'
);

-- Delete anonymous users older than 30 days
DELETE FROM auth.users
WHERE 
    is_anonymous = true 
    AND created_at < NOW() - INTERVAL '30 days';
*/

-- Step 4: Verify cleanup results (run after cleanup)
SELECT 
    'anonymous_users' as table_name,
    COUNT(*) as remaining_count
FROM auth.users
WHERE is_anonymous = true
UNION ALL
SELECT 
    'time_records' as table_name,
    COUNT(*) as remaining_count
FROM time_records tr
JOIN auth.users u ON tr.user_id = u.id
WHERE u.is_anonymous = true;

-- Optional: Get statistics about anonymous user activity
SELECT 
    CASE 
        WHEN created_at >= NOW() - INTERVAL '1 day' THEN 'Last 24 hours'
        WHEN created_at >= NOW() - INTERVAL '7 days' THEN 'Last week'
        WHEN created_at >= NOW() - INTERVAL '30 days' THEN 'Last month'
        ELSE 'Older than 30 days'
    END as time_range,
    COUNT(*) as user_count
FROM auth.users
WHERE is_anonymous = true
GROUP BY 
    CASE 
        WHEN created_at >= NOW() - INTERVAL '1 day' THEN 'Last 24 hours'
        WHEN created_at >= NOW() - INTERVAL '7 days' THEN 'Last week'
        WHEN created_at >= NOW() - INTERVAL '30 days' THEN 'Last month'
        ELSE 'Older than 30 days'
    END
ORDER BY 
    CASE 
        WHEN time_range = 'Last 24 hours' THEN 1
        WHEN time_range = 'Last week' THEN 2
        WHEN time_range = 'Last month' THEN 3
        ELSE 4
    END;