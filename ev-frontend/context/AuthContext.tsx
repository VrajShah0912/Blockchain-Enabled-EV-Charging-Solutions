'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, register, getCurrentUser, logout as authLogout } from '@/lib/auth';

interface AuthContextType {
  user: any;
  token: string | undefined;
  login: (email: string, password: string, isAdmin: boolean) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirm: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        authLogout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = async (email: string, password: string, isAdmin: boolean) => {
    const { token, user } = await login(email, password, isAdmin);
    setToken(token); // Replaced storeToken with setToken
    setUser(user);
  };

  const handleRegister = async (name: string, email: string, password: string, passwordConfirm: string) => {
    const { token, user } = await register(name, email, password, passwordConfirm);
    setToken(token); // Replaced storeToken with setToken
    setUser(user);
  };

  const handleLogout = () => {
    authLogout();
    setUser(null);
    setToken(undefined);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        isLoading,
      }}
    >
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
