import { getDocuments, addDocument, updateDocument, deleteDocument, orderBy } from '@/api/firestore';
import { COLLECTIONS } from '@/constants';

export const employeeService = {
  getEmployees: () =>
    getDocuments(COLLECTIONS.EMPLOYEES, orderBy('name')),

  addEmployee: (data) =>
    addDocument(COLLECTIONS.EMPLOYEES, data),

  updateEmployee: (id, data) =>
    updateDocument(COLLECTIONS.EMPLOYEES, id, data),

  deleteEmployee: (id) =>
    deleteDocument(COLLECTIONS.EMPLOYEES, id),
};
