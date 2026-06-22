import { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  loginUser,
  registerUser,
  logoutUser,
  resetPassword,
  onAuthChange,
} from '@/api/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = useCallback((email, password) => loginUser(email, password), []);
  const register = useCallback((email, password) => registerUser(email, password), []);
  const logout = useCallback(() => logoutUser(), []);
  const forgotPassword = useCallback((email) => resetPassword(email), []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      forgotPassword,
    }),
    [user, loading, login, register, logout, forgotPassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
