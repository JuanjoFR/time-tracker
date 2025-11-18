'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/shared/infrastructure/persistence/supabase-client';

/**
 * SignOutButton - Client Component
 * Handles user sign-out using browser client to properly clear cookies
 * Uses shared infrastructure layer for Supabase client creation
 */
export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    // Use shared browser client from infrastructure layer
    const supabase = createClient();

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
      Sign Out
    </button>
  );
}
