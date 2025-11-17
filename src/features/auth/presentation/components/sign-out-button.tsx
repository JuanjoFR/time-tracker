'use client';

import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

/**
 * SignOutButton - Client Component
 * Handles user sign-out using browser client to properly clear cookies
 */
export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Sign out using browser client - properly clears cookies
    await supabase.auth.signOut();

    // Refresh the page to trigger middleware (creates new anonymous user)
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
    >
      Cerrar Sesión
    </button>
  );
}
