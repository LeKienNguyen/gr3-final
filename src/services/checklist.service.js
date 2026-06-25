import { getDocuments, addDocument, updateDocument, deleteDocument, orderBy, where } from '@/api/firestore';
import { COLLECTIONS } from '@/constants';

export const checklistService = {
  getAll: () =>
    getDocuments(COLLECTIONS.CHECKLISTS, orderBy('date', 'desc')),

  getByDate: (date) =>
    getDocuments(COLLECTIONS.CHECKLISTS, where('date', '==', date)),

  add: (data) =>
    addDocument(COLLECTIONS.CHECKLISTS, data),

  update: (id, data) =>
    updateDocument(COLLECTIONS.CHECKLISTS, id, data),

  delete: (id) =>
    deleteDocument(COLLECTIONS.CHECKLISTS, id),
};
