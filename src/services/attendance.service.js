import { getDocuments, addDocument, updateDocument, deleteDocument, orderBy, where } from '@/api/firestore';
import { COLLECTIONS } from '@/constants';

export const attendanceService = {
  getByDate: (date) =>
    getDocuments(COLLECTIONS.ATTENDANCE, where('date', '==', date), orderBy('name')),

  getByEmployee: (employeeId) =>
    getDocuments(COLLECTIONS.ATTENDANCE, where('employeeId', '==', employeeId), orderBy('date', 'desc')),

  getByDateRange: (startDate, endDate) =>
    getDocuments(COLLECTIONS.ATTENDANCE, where('date', '>=', startDate), where('date', '<=', endDate), orderBy('date')),

  getByEmployeeAndDateRange: (employeeId, startDate, endDate) =>
    getDocuments(COLLECTIONS.ATTENDANCE, where('employeeId', '==', employeeId), where('date', '>=', startDate), where('date', '<=', endDate)),

  add: (data) =>
    addDocument(COLLECTIONS.ATTENDANCE, data),

  update: (id, data) =>
    updateDocument(COLLECTIONS.ATTENDANCE, id, data),

  delete: (id) =>
    deleteDocument(COLLECTIONS.ATTENDANCE, id),
};
