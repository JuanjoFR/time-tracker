import { User, UserSchema } from './auth.types';

/**
 * Factory function to create a User from Supabase auth data
 * @param supabaseUser - Raw user data from Supabase
 * @returns Validated User domain object
 */
export const createUser = (supabaseUser: {
  id: string;
  email?: string;
  is_anonymous?: boolean;
  created_at?: string;
}): User => {
  const user = {
    id: supabaseUser.id,
    isAnonymous: supabaseUser.is_anonymous ?? true,
    email: supabaseUser.email || undefined,
    createdAt: supabaseUser.created_at
      ? new Date(supabaseUser.created_at)
      : new Date(),
  };

  return UserSchema.parse(user);
};

/**
 * Check if a user is anonymous based on domain rules
 * @param user - User domain object
 * @returns Boolean indicating if user is anonymous
 */
export const isAnonymousUser = (user: User): boolean => {
  return user.isAnonymous;
};

/**
 * Check if a user session is valid (not expired based on creation date)
 * This is a simple check - actual session validation happens in infrastructure
 * @param user - User domain object
 * @returns Boolean indicating if user session is likely valid
 */
export const isUserSessionValid = (user: User): boolean => {
  const now = new Date();
  const sessionAge = now.getTime() - user.createdAt.getTime();
  const maxSessionAge = 60 * 60 * 1000; // 1 hour in milliseconds

  return sessionAge < maxSessionAge;
};
