import { z } from 'zod';

// Domain Types for Authentication
export const AnonymousUserSchema = z.object({
  id: z.string().uuid(),
  isAnonymous: z.boolean(),
  email: z.string().email().optional(),
  createdAt: z.date(),
});

export type AnonymousUser = z.infer<typeof AnonymousUserSchema>;

// Input types for use cases
export const SignInAnonymouslyInputSchema = z.object({
  // No input required for anonymous sign-in
});

export type SignInAnonymouslyInput = z.infer<
  typeof SignInAnonymouslyInputSchema
>;

// Result types for use cases
export type AuthResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// Auth error types for specific error handling
export type AuthError =
  | 'NETWORK_ERROR'
  | 'RATE_LIMIT_EXCEEDED'
  | 'SERVICE_UNAVAILABLE'
  | 'INVALID_REQUEST'
  | 'UNKNOWN_ERROR';

// Auth error messages mapping
export const AuthErrorMessages: Record<AuthError, string> = {
  NETWORK_ERROR:
    'Network connection failed. Please check your internet connection.',
  RATE_LIMIT_EXCEEDED: 'Too many sign-in attempts. Please try again later.',
  SERVICE_UNAVAILABLE: 'Authentication service is temporarily unavailable.',
  INVALID_REQUEST: 'Invalid authentication request.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};
