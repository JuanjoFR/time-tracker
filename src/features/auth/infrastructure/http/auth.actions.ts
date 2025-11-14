'use server';

import { ensureAnonymousUserUseCase } from '../../application/use-cases/ensure-anonymous-user';
import { getCurrentUserUseCase } from '../../application/use-cases/get-current-user';
import { signOutUseCase } from '../../application/use-cases/sign-out';

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

export async function signOutAction() {
  await signOutUseCase();
}
