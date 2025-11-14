import { createSupabaseAuthRepository } from './supabase-auth.repository';

/**
 * Auth Repository Instance
 * Dependency injection container for auth repository
 * Can be easily swapped for different implementations (testing, different providers)
 */
export const authRepository = createSupabaseAuthRepository();
