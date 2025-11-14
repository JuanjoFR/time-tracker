import { AuthRepository } from '../../application/ports/auth.repository';
import {
  AnonymousUser,
  AuthResult,
  AuthError,
  AuthErrorMessages,
} from '../../domain/auth.types';
import { createAnonymousUser } from '../../domain/auth.factory';
import { createClient } from '@/shared/infrastructure/persistence/supabase-client';

/**
 * Supabase implementation of AuthRepository
 * Handles anonymous authentication using Supabase Auth
 */
export const createSupabaseAuthRepository = (): AuthRepository => {
  return {
    getCurrentUser: async (): Promise<AnonymousUser | null> => {
      try {
        const supabase = createClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          // "Auth session missing!" is expected for new users - not an error
          if (error.message.includes('Auth session missing')) {
            return null;
          }
          console.error('Error getting current user:', error.message);
          return null;
        }

        if (!user) {
          return null;
        }

        return createAnonymousUser({
          id: user.id,
          email: user.email,
          is_anonymous: user.is_anonymous,
          created_at: user.created_at,
        });
      } catch (error) {
        console.error('Unexpected error getting current user:', error);
        return null;
      }
    },

    signInAnonymously: async (): Promise<AuthResult<AnonymousUser>> => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInAnonymously();

        if (error) {
          const authError = mapSupabaseErrorToAuthError(error.message);
          return {
            success: false,
            error: AuthErrorMessages[authError],
          };
        }

        if (!data.user) {
          return {
            success: false,
            error: AuthErrorMessages.UNKNOWN_ERROR,
          };
        }

        const anonymousUser = createAnonymousUser({
          id: data.user.id,
          email: data.user.email,
          is_anonymous: data.user.is_anonymous,
          created_at: data.user.created_at,
        });

        return {
          success: true,
          data: anonymousUser,
        };
      } catch (error) {
        console.error('Unexpected error signing in anonymously:', error);
        return {
          success: false,
          error: AuthErrorMessages.UNKNOWN_ERROR,
        };
      }
    },

    signOut: async (): Promise<AuthResult<void>> => {
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.signOut();

        if (error) {
          const authError = mapSupabaseErrorToAuthError(error.message);
          return {
            success: false,
            error: AuthErrorMessages[authError],
          };
        }

        return {
          success: true,
          data: undefined,
        };
      } catch (error) {
        console.error('Unexpected error signing out:', error);
        return {
          success: false,
          error: AuthErrorMessages.UNKNOWN_ERROR,
        };
      }
    },

    refreshSession: async (): Promise<AuthResult<AnonymousUser | null>> => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.refreshSession();

        if (error) {
          const authError = mapSupabaseErrorToAuthError(error.message);
          return {
            success: false,
            error: AuthErrorMessages[authError],
          };
        }

        if (!data.user) {
          return {
            success: true,
            data: null,
          };
        }

        const anonymousUser = createAnonymousUser({
          id: data.user.id,
          email: data.user.email,
          is_anonymous: data.user.is_anonymous,
          created_at: data.user.created_at,
        });

        return {
          success: true,
          data: anonymousUser,
        };
      } catch (error) {
        console.error('Unexpected error refreshing session:', error);
        return {
          success: false,
          error: AuthErrorMessages.UNKNOWN_ERROR,
        };
      }
    },
  };
};

/**
 * Map Supabase error messages to our domain AuthError types
 * @param errorMessage - Supabase error message
 * @returns Mapped AuthError type
 */
const mapSupabaseErrorToAuthError = (errorMessage: string): AuthError => {
  const message = errorMessage.toLowerCase();

  if (message.includes('rate limit') || message.includes('too many')) {
    return 'RATE_LIMIT_EXCEEDED';
  }

  if (message.includes('network') || message.includes('connection')) {
    return 'NETWORK_ERROR';
  }

  if (message.includes('service') || message.includes('unavailable')) {
    return 'SERVICE_UNAVAILABLE';
  }

  if (message.includes('invalid') || message.includes('bad request')) {
    return 'INVALID_REQUEST';
  }

  return 'UNKNOWN_ERROR';
};
