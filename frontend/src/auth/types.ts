import type { ReactNode } from 'react';

export type AuthContextProps = {
  isAuthenticated: boolean;
  user: string | null;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<string | null>>;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
  checkAuth: (userId: string) => Promise<void>;
};

export type AuthResponse = {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type AuthProviderProps = {
  children: ReactNode;
};
