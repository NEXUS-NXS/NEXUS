'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  getAuthToken, 
  getUser, 
  setUser, 
  setAuthToken, 
  removeAuthToken, 
  isAuthenticated as checkAuth, 
  redirectToLogin, 
  initializeAuthFromParams,
  checkAuthenticationStatus,
  logout as authLogout
} from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    setIsLoading(true);
    
    try {
      // Check if user came from main app with existing auth
      const hasAuthFromMain = initializeAuthFromParams();
      
      if (hasAuthFromMain || checkAuth()) {
        const userData = getUser();
        const token = getAuthToken();
        
        if (userData && token) {
          // Verify the token is still valid
          const isValid = await checkAuthenticationStatus();
          
          if (isValid) {
            setUserState(userData);
            setIsAuthenticated(true);
          } else {
            // Token expired, clean up and redirect to login
            handleLogout();
          }
        } else {
          // Invalid auth state, clean up
          handleLogout();
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (token: string, userData: User) => {
    setAuthToken(token);
    setUser(userData);
    setUserState(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await authLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUserState(null);
      setIsAuthenticated(false);
    }
  };

  const refreshUser = () => {
    const userData = getUser();
    if (userData) {
      setUserState(userData);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// HOC for protecting routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      redirectToLogin();
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-gray-600">Redirecting to login...</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
