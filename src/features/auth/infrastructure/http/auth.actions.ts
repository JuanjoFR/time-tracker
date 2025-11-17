'use server';

import { ensureAnonymousUserUseCase } from '../../application/use-cases/ensure-anonymous-user';
import { getCurrentUserUseCase } from '../../application/use-cases/get-current-user';

/**
 * Auth Server Actions
 * HTTP layer for authentication operations following hexagonal architecture
 * These actions bridge the presentation layer with application use cases
 */

export async function ensureAnonymousUserAction() {
  const result = await ensureAnonymousUserUseCase();
  return result;
}

export async function getCurrentUserAction() {
  return await getCurrentUserUseCase();
}

// Note: Sign out is handled client-side in presentation/components/sign-out-button.tsx
// This follows Supabase SSR best practices - browser client properly clears cookies
