import { getDocuments, addDocument, updateDocument, deleteDocument, orderBy, where } from '@/api/firestore';
import { COLLECTIONS } from '@/constants';

export const scheduleService = {
  getByWeek: (weekStart) =>
    getDocuments(COLLECTIONS.SCHEDULES, where('weekStart', '==', weekStart)),

  getByEmployee: (employeeId) =>
    getDocuments(COLLECTIONS.SCHEDULES, where('employeeId', '==', employeeId), orderBy('date')),

  getByEmployeeAndWeek: (employeeId, weekStart) =>
    getDocuments(COLLECTIONS.SCHEDULES, where('employeeId', '==', employeeId), where('weekStart', '==', weekStart)),

  add: (data) =>
    addDocument(COLLECTIONS.SCHEDULES, data),

  update: (id, data) =>
    updateDocument(COLLECTIONS.SCHEDULES, id, data),

  delete: (id) =>
    deleteDocument(COLLECTIONS.SCHEDULES, id),
};
