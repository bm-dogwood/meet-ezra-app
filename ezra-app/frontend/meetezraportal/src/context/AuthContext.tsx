'use client';

// ===========================================
// EZRA PORTAL - Authentication Context (Django JWT)
// ===========================================

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, AuthState, LoginFormData } from '@/types';
import { 
  login as djangoLogin, 
  logout as djangoLogout, 
  register as djangoRegister,
  getStoredUser, 
  getAccessToken,
  onAuthError,
  User as DjangoUser 
} from '@/lib/auth';

interface AuthContextValue extends AuthState {
  login: (credentials: LoginFormData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Convert Django user to app User type
function djangoUserToAppUser(djangoUser: DjangoUser): User {
  return {
    id: String(djangoUser.id),
    email: djangoUser.email,
    name: djangoUser.first_name && djangoUser.last_name 
      ? `${djangoUser.first_name} ${djangoUser.last_name}` 
      : djangoUser.username,
    role: djangoUser.role as any,
    clientId: djangoUser.tenant ? String(djangoUser.tenant) : '',
    clientName: djangoUser.tenant_name || '',
    permissions: ['view_all_locations', 'export_data', 'view_reports', 'manage_settings'],
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    token: null,
  });

  // Listen for auth errors (token refresh failure, etc.)
  useEffect(() => {
    const unsubscribe = onAuthError(() => {
      // Clear auth state and redirect to login
      djangoLogout();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: null,
      });
    });
    return unsubscribe;
  }, []);

  // Check for stored auth on mount
  useEffect(() => {
    const storedUser = getStoredUser();
    const token = getAccessToken();
    
    if (storedUser && token) {
      setState({
        user: djangoUserToAppUser(storedUser),
        isAuthenticated: true,
        isLoading: false,
        token,
      });
    } else {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: null,
      });
    }
  }, []);

  /**
   * Login function using Django JWT
   */
  const login = useCallback(async (credentials: LoginFormData) => {
    try {
      const response = await djangoLogin(credentials.email, credentials.password);
      setState({
        user: djangoUserToAppUser(response.user),
        isAuthenticated: true,
        isLoading: false,
        token: response.tokens.access,
      });
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Invalid credentials' };
    }
  }, []);

  /**
   * Logout and clear stored auth
   */
  const logout = useCallback(() => {
    djangoLogout();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
    });
  }, []);

  /**
   * Update user data
   */
  const updateUser = useCallback((updates: Partial<User>) => {
    setState((prev) => {
      if (!prev.user) return prev;
      return {
        ...prev,
        user: { ...prev.user, ...updates },
      };
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Hook to check if user has a specific permission
 */
export function usePermission(permission: User['permissions'][number]): boolean {
  const { user } = useAuth();
  return user?.permissions.includes(permission) ?? false;
}

/**
 * Hook to check if user has any of the specified permissions
 */
export function useAnyPermission(permissions: User['permissions'][number][]): boolean {
  const { user } = useAuth();
  return permissions.some((p) => user?.permissions.includes(p)) ?? false;
}

export { AuthContext };
