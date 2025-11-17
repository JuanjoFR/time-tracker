import { User, AuthResult } from '../../domain/auth.types';
import { authRepository } from '../../infrastructure/persistence/repository.instance';

/**
 * Ensure Anonymous User Use Case
 * Ensures that a user is authenticated (anonymous or permanent)
 * If no user exists, creates an anonymous user automatically
 */
export const ensureAnonymousUserUseCase = async (): Promise<
  AuthResult<User>
> => {
  try {
    // First, try to get the current user
    const currentUser = await authRepository.getCurrentUser();

    if (currentUser) {
      // User already exists, return them
      return {
        success: true,
        data: currentUser,
      };
    }

    // No user exists, sign in anonymously
    const signInResult = await authRepository.signInAnonymously();

    if (!signInResult.success) {
      return signInResult;
    }

    return {
      success: true,
      data: signInResult.data,
    };
  } catch (error) {
    console.error('Error in ensureAnonymousUserUseCase:', error);
    return {
      success: false,
      error: 'Failed to ensure user authentication. Please try again.',
    };
  }
};
