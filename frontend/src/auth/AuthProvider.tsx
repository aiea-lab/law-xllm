import { setCookie, parseCookies } from 'nookies';
import type { ReactNode } from 'react';
import { createContext, useState, useEffect } from 'react';

import type { AuthContextProps, AuthResponse } from './types';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const cookies = parseCookies();
    const storedIsAuthenticated = cookies.isAuthenticated;
    const storedUser = cookies.user;
    const storedUserId = cookies.userId;

    if (storedIsAuthenticated === 'true' && storedUser && storedUserId) {
      setIsAuthenticated(true);
      setUser(storedUser);
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user && userId) {
      setCookie(null, 'isAuthenticated', 'true', { maxAge: 30 * 24 * 60 * 60, path: '/' });
      setCookie(null, 'user', user, { maxAge: 30 * 24 * 60 * 60, path: '/' });
      setCookie(null, 'userId', userId, { maxAge: 30 * 24 * 60 * 60, path: '/' });
    }
    // else {
    //   destroyCookie(null, 'isAuthenticated');
    //   destroyCookie(null, 'user');
    //   destroyCookie(null, 'userId');
    // }
  }, [isAuthenticated, user, userId]);

  const checkAuth = async (userId: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/auth/check/${userId}`);
      if (response.ok) {
        const data = (await response.json()) as AuthResponse;
        setIsAuthenticated(data.isAuthenticated);
        setUser(data.user.name);
        setUserId(data.user.id);
      }
      // else {
      //   setIsAuthenticated(false);
      //   setUser(null);
      //   setUserId(null);
      // }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
      setUser(null);
      setUserId(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, setIsAuthenticated, setUser, setUserId, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthProvider;
