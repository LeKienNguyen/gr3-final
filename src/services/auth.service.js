import { loginUser, logoutUser, resetPassword } from '@/api/auth';
import { getDocument, updateDocument } from '@/api/firestore';
import { COLLECTIONS } from '@/constants';

export const authService = {
  login: (email, password) => loginUser(email, password),

  logout: () => logoutUser(),

  resetPassword: (email) => resetPassword(email),

  getUserProfile: (uid) => getDocument(COLLECTIONS.USERS, uid),

  updateUserProfile: (uid, data) => updateDocument(COLLECTIONS.USERS, uid, data),
};
