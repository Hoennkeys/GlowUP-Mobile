import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { signIn, signOut, signUp, resetPassword } from '../services/authService';
import { updateProfile as updateProfileService } from '../services/profileService';
import type { LoginCredentials, RegisterCredentials, UpdateProfilePayload } from '../types/auth';
import type { AuthUser } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (creds: LoginCredentials) => Promise<void>;
  register: (creds: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  forgotPassword: async () => {},
  updateProfile: async () => {},
  clearError: () => {},
});

function mapSupabaseUser(supabaseUser: SupabaseUser): AuthUser {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    name: supabaseUser.user_metadata?.name ?? supabaseUser.email ?? '',
    avatarUrl: supabaseUser.user_metadata?.avatar_url,
    bio: supabaseUser.user_metadata?.bio,
    createdAt: supabaseUser.created_at,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ? mapSupabaseUser(data.session.user) : null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? mapSupabaseUser(session.user) : null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = useCallback(async (creds: LoginCredentials) => {
    setError(null);
    try {
      await signIn(creds);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erro ao fazer login.';
      setError(message);
      throw e;
    }
  }, []);

  const register = useCallback(async (creds: RegisterCredentials) => {
    setError(null);
    try {
      await signUp(creds);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erro ao criar conta.';
      setError(message);
      throw e;
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await signOut();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erro ao sair.';
      setError(message);
      throw e;
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    setError(null);
    try {
      await resetPassword(email);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erro ao enviar email de recuperação.';
      setError(message);
      throw e;
    }
  }, []);

  const updateProfile = useCallback(async (payload: UpdateProfilePayload) => {
    if (!user) return;
    setError(null);
    try {
      await updateProfileService(user.id, payload);
      setUser(prev =>
        prev ? { ...prev, ...payload, avatarUrl: payload.avatarUrl ?? prev.avatarUrl } : prev,
      );
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erro ao atualizar perfil.';
      setError(message);
      throw e;
    }
  }, [user]);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        register,
        logout,
        forgotPassword,
        updateProfile,
        clearError,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
