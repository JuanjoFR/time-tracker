import { createBrowserClient } from '@supabase/ssr';

// Example file: https://github.com/supabase/supabase/blob/23c7c8c63e14a61684e67beba954a24fd81aa3da/examples/auth/nextjs/utils/supabase/client.ts

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              if (typeof document !== 'undefined') {
                const expires = options?.expires
                  ? new Date(options.expires)
                  : undefined;
                document.cookie = `${name}=${value}; path=${
                  options?.path || '/'
                }; ${expires ? `expires=${expires.toUTCString()};` : ''} ${
                  options?.secure ? 'secure;' : ''
                } ${options?.sameSite ? `samesite=${options.sameSite};` : ''}`;
              }
            });
          } catch {
            // Fail silently - cookies might not be available in SSR
          }
        },
      },
    }
  );
}
