'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { toast } from 'sonner';
import { AnonymousUser } from '../../domain/auth.types';
import { ensureAnonymousUserUseCase } from '../../application/use-cases/ensure-anonymous-user';
import { getCurrentUserUseCase } from '../../application/use-cases/get-current-user';
import { signOutUseCase } from '../../application/use-cases/sign-out';

interface AuthContextType {
  user: AnonymousUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AnonymousUser | null>(null);
  const [loading, setLoading] = useState(true);

  const initializeAuth = useCallback(async () => {
    try {
      // First check if user is already authenticated
      const currentUserResult = await getCurrentUserUseCase();

      if (currentUserResult.success && currentUserResult.data) {
        setUser(currentUserResult.data);
        setLoading(false);
        return;
      }

      // If no user exists, automatically sign in anonymously
      const ensureUserResult = await ensureAnonymousUserUseCase();

      if (ensureUserResult.success) {
        setUser(ensureUserResult.data);
      } else {
        // Show specific error message to user
        toast.error(`Authentication failed: ${ensureUserResult.error}`, {
          duration: 5000,
          action: {
            label: 'Retry',
            onClick: () => initializeAuth(),
          },
        });
      }
    } catch (error) {
      console.error('Unexpected error during auth initialization:', error);
      toast.error('An unexpected error occurred. Please refresh the page.', {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSignOut = async () => {
    try {
      const signOutResult = await signOutUseCase();

      if (signOutResult.success) {
        setUser(null);
        toast.success('Successfully signed out');
      } else {
        toast.error(`Sign out failed: ${signOutResult.error}`);
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      toast.error('An unexpected error occurred during sign out');
    }
  };

  const handleRefreshUser = async () => {
    try {
      const currentUserResult = await getCurrentUserUseCase();

      if (currentUserResult.success) {
        setUser(currentUserResult.data);
      } else {
        toast.error(`Failed to refresh user: ${currentUserResult.error}`);
      }
    } catch (error) {
      console.error('Unexpected error during user refresh:', error);
      toast.error('An unexpected error occurred while refreshing user data');
    }
  };

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const contextValue: AuthContextType = {
    user,
    loading,
    signOut: handleSignOut,
    refreshUser: handleRefreshUser,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
