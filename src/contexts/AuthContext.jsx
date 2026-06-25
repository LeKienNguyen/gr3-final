import { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  loginUser,
  logoutUser,
  resetPassword,
  onAuthChange,
} from '@/api/auth';
import { getDocuments, where } from '@/api/firestore';
import { COLLECTIONS } from '@/constants';
import { ROLES } from '@/constants/roles';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (firebaseUser) => {
    if (!firebaseUser) {
      setUserProfile(null);
      return null;
    }
    try {
      const snap = await getDocuments(COLLECTIONS.USERS, where('uid', '==', firebaseUser.uid));
      if (!snap.empty) {
        const docData = snap.docs[0];
        const profile = { id: docData.id, ...docData.data() };
        setUserProfile(profile);
        return profile;
      }
      setUserProfile(null);
      return null;
    } catch {
      setUserProfile(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchUserProfile(firebaseUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [fetchUserProfile]);

  const login = useCallback(async (email, password) => {
    const credential = await loginUser(email, password);
    const profile = await fetchUserProfile(credential.user);
    return { credential, profile };
  }, [fetchUserProfile]);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
    setUserProfile(null);
  }, []);

  const forgotPassword = useCallback((email) => resetPassword(email), []);

  const value = useMemo(
    () => ({
      user,
      userProfile,
      loading,
      isAuthenticated: !!user,
      isManager: userProfile?.role === ROLES.MANAGER,
      isEmployee: userProfile?.role === ROLES.EMPLOYEE,
      mustChangePassword: userProfile?.mustChangePassword === true,
      role: userProfile?.role || null,
      login,
      logout,
      forgotPassword,
      refreshProfile: () => user && fetchUserProfile(user),
    }),
    [user, userProfile, loading, login, logout, forgotPassword, fetchUserProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
