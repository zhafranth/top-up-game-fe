import React, { createContext, useContext } from 'react';
import { useLogin, useLogout, useAuthStatus } from '../hooks/useAuth';

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const { isAuthenticated, user } = useAuthStatus();

  const login = (username: string, password: string) => {
    loginMutation.mutate({ username, password });
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    isLoading: loginMutation.isPending || logoutMutation.isPending
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

// Protected Route Component
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-4">You need to login to access this page.</p>
          <a href="/auth" className="text-primary hover:underline">Go to Login</a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}