import { User, AuthResult } from '../../domain/auth.types';

/**
 * Auth Repository Port (Interface)
 * Defines the contract for authentication operations
 * Implementation will be in the infrastructure layer
 */
export interface AuthRepository {
  /**
   * Get the currently authenticated user
   * @returns Promise resolving to the current user or null if not authenticated
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Sign in anonymously and create a temporary user
   * @returns Promise resolving to auth result with user data
   */
  signInAnonymously(): Promise<AuthResult<User>>;

  /**
   * Sign out the current user and terminate session
   * @returns Promise resolving to auth result
   */
  signOut(): Promise<AuthResult<void>>;

  /**
   * Refresh the current session if needed
   * @returns Promise resolving to auth result with refreshed user data
   */
  refreshSession(): Promise<AuthResult<User | null>>;
}
