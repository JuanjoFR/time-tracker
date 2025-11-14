-- Sample data for development testing with anonymous users
-- Creates realistic time tracking records for testing the application

-- Note: This seed data will create records, but they won't be accessible 
-- until users sign in anonymously, as RLS policies require authentication.
-- The actual seeding of user-specific data happens through the application
-- when anonymous users are created.

-- Create some sample anonymous users for development (simulating the auth.users table)
-- In real usage, these would be created automatically by Supabase Auth
DO $$
DECLARE
    user1_id UUID := 'a0a00000-0000-4000-8000-000000000001';
    user2_id UUID := 'a0a00000-0000-4000-8000-000000000002';
BEGIN
    -- Insert sample anonymous users into auth.users if they don't exist
    -- This is only for development seeding - in production, Supabase Auth handles this
    INSERT INTO auth.users (id, aud, role, email, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, is_anonymous)
    VALUES 
        (user1_id, 'authenticated', 'authenticated', NULL, '{"provider":"anonymous","providers":["anonymous"]}', '{}', false, NOW(), NOW(), true),
        (user2_id, 'authenticated', 'authenticated', NULL, '{"provider":"anonymous","providers":["anonymous"]}', '{}', false, NOW(), NOW(), true)
    ON CONFLICT (id) DO NOTHING;

    -- Sample time records for user 1
    INSERT INTO time_records (description, duration_in_seconds, created_at, user_id) VALUES
        ('Morning standup meeting', 900, NOW() - INTERVAL '5 hours', user1_id),
        ('Code review for authentication feature', 2700, NOW() - INTERVAL '4 hours', user1_id),
        ('Implement user dashboard components', 5400, NOW() - INTERVAL '3 hours', user1_id),
        ('Documentation updates', 1800, NOW() - INTERVAL '2 hours', user1_id),
        ('Testing and bug fixes', 3600, NOW() - INTERVAL '1 hour', user1_id),
        ('Client meeting - project requirements', 3900, NOW() - INTERVAL '6 hours', user1_id),
        ('Database schema design', 4200, NOW() - INTERVAL '7 hours', user1_id);

    -- Sample time records for user 2 (different user, different data)
    INSERT INTO time_records (description, duration_in_seconds, created_at, user_id) VALUES
        ('Frontend component development', 6000, NOW() - INTERVAL '3 hours', user2_id),
        ('API integration testing', 2400, NOW() - INTERVAL '2 hours', user2_id),
        ('Performance optimization', 4800, NOW() - INTERVAL '5 hours', user2_id),
        ('Team retrospective meeting', 1200, NOW() - INTERVAL '6 hours', user2_id);

END $$;

-- Verify data was inserted
SELECT 
    description, 
    duration_in_seconds, 
    created_at,
    user_id,
    CASE 
        WHEN user_id = 'a0a00000-0000-4000-8000-000000000001' THEN 'User 1'
        WHEN user_id = 'a0a00000-0000-4000-8000-000000000002' THEN 'User 2'
        ELSE 'Unknown'
    END as user_label
FROM time_records 
ORDER BY user_id, created_at DESC;