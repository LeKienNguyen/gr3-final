import { getDocuments, addDocument, orderBy, limit } from '@/api/firestore';
import { COLLECTIONS } from '@/constants';

export const activityService = {
  getRecent: (count = 10) =>
    getDocuments(COLLECTIONS.ACTIVITIES, orderBy('timestamp', 'desc'), limit(count)),

  log: (data) =>
    addDocument(COLLECTIONS.ACTIVITIES, {
      ...data,
      timestamp: new Date().toISOString(),
    }),
};
