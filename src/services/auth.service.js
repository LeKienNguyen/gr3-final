import { loginUser, registerUser, logoutUser, resetPassword, updateUserProfile } from '@/api/auth';
import { addDocument, getDocument, updateDocument } from '@/api/firestore';
import { COLLECTIONS } from '@/constants';

export const authService = {
  login: (email, password) => loginUser(email, password),

  register: async (email, password, profileData) => {
    const credential = await registerUser(email, password);
    await updateUserProfile(credential.user, { displayName: profileData.name });
    await addDocument(COLLECTIONS.USERS, {
      uid: credential.user.uid,
      email,
      ...profileData,
    });
    return credential;
  },

  logout: () => logoutUser(),

  resetPassword: (email) => resetPassword(email),

  getUserProfile: (uid) => getDocument(COLLECTIONS.USERS, uid),

  updateUserProfile: (uid, data) => updateDocument(COLLECTIONS.USERS, uid, data),
};
