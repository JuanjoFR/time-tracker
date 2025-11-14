import { AnonymousUser, AnonymousUserSchema } from './auth.types';

/**
 * Factory function to create an AnonymousUser from Supabase auth data
 * @param supabaseUser - Raw user data from Supabase
 * @returns Validated AnonymousUser domain object
 */
export const createAnonymousUser = (supabaseUser: {
  id: string;
  email?: string;
  is_anonymous?: boolean;
  created_at?: string;
}): AnonymousUser => {
  const user = {
    id: supabaseUser.id,
    isAnonymous: supabaseUser.is_anonymous ?? true,
    email: supabaseUser.email,
    createdAt: supabaseUser.created_at
      ? new Date(supabaseUser.created_at)
      : new Date(),
  };

  return AnonymousUserSchema.parse(user);
};

/**
 * Check if a user is anonymous based on domain rules
 * @param user - AnonymousUser domain object
 * @returns Boolean indicating if user is anonymous
 */
export const isAnonymousUser = (user: AnonymousUser): boolean => {
  return user.isAnonymous;
};

/**
 * Check if a user session is valid (not expired based on creation date)
 * This is a simple check - actual session validation happens in infrastructure
 * @param user - AnonymousUser domain object
 * @returns Boolean indicating if user session is likely valid
 */
export const isUserSessionValid = (user: AnonymousUser): boolean => {
  const now = new Date();
  const sessionAge = now.getTime() - user.createdAt.getTime();
  const maxSessionAge = 60 * 60 * 1000; // 1 hour in milliseconds

  return sessionAge < maxSessionAge;
};
