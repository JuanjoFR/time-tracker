import { AuthResult } from '../../domain/auth.types';
import { authRepository } from '../../infrastructure/persistence/repository.instance';

/**
 * Sign Out Use Case
 * Signs out the current user and terminates their session
 */
export const signOutUseCase = async (): Promise<AuthResult<void>> => {
  try {
    const signOutResult = await authRepository.signOut();

    if (!signOutResult.success) {
      return signOutResult;
    }

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error('Error in signOutUseCase:', error);
    return {
      success: false,
      error: 'Failed to sign out. Please try again.',
    };
  }
};
