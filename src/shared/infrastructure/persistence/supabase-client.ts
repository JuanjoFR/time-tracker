import { createBrowserClient } from '@supabase/ssr';

// Example file: https://github.com/supabase/supabase/blob/23c7c8c63e14a61684e67beba954a24fd81aa3da/examples/auth/nextjs/utils/supabase/client.ts

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
