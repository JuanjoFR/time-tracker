import { AnonymousUser, AuthResult } from '../../domain/auth.types';
import { authRepository } from '../../infrastructure/persistence/repository.instance';

/**
 * Get Current User Use Case
 * Retrieves the currently authenticated user
 * Returns null if no user is authenticated
 */
export const getCurrentUserUseCase = async (): Promise<
  AuthResult<AnonymousUser | null>
> => {
  try {
    const currentUser = await authRepository.getCurrentUser();

    return {
      success: true,
      data: currentUser,
    };
  } catch (error) {
    console.error('Error in getCurrentUserUseCase:', error);
    return {
      success: false,
      error: 'Failed to get current user. Please try again.',
    };
  }
};
