import { getDocument, updateDocument } from '@/api/firestore';
import { COLLECTIONS } from '@/constants';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/api/firebase';
import { serverTimestamp } from 'firebase/firestore';

export const settingsService = {
  getRestaurant: () =>
    getDocument(COLLECTIONS.SETTINGS, 'restaurant'),

  saveRestaurant: async (data) => {
    const ref = doc(db, COLLECTIONS.SETTINGS, 'restaurant');
    await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
  },

  getUserProfile: (uid) =>
    getDocument(COLLECTIONS.USERS, uid),

  updateUserProfile: (uid, data) =>
    updateDocument(COLLECTIONS.USERS, uid, data),
};
