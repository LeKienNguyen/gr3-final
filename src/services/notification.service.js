import { getDocuments, addDocument, updateDocument, where, orderBy } from '@/api/firestore';

const COLLECTION = 'notifications';

export const notificationService = {
  getNotifications: (userId) =>
    getDocuments(COLLECTION, where('userId', '==', userId), orderBy('createdAt', 'desc')),

  getUnread: (userId) =>
    getDocuments(COLLECTION, where('userId', '==', userId), where('read', '==', false)),

  markAsRead: (notificationId) =>
    updateDocument(COLLECTION, notificationId, { read: true }),

  create: (data) =>
    addDocument(COLLECTION, { ...data, read: false }),
};
