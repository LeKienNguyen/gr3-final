import { getDocuments, addDocument, where, orderBy } from '@/api/firestore';
import { COLLECTIONS } from '@/constants';

export const salesService = {
  getOrders: () =>
    getDocuments(COLLECTIONS.ORDERS, orderBy('createdAt', 'desc')),

  getOrdersByDateRange: (startDate, endDate) =>
    getDocuments(
      COLLECTIONS.ORDERS,
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', endDate),
      orderBy('createdAt', 'desc'),
    ),

  addOrder: (data) =>
    addDocument(COLLECTIONS.ORDERS, data),

  getDailySales: (date) =>
    getDocuments(COLLECTIONS.SALES, where('date', '==', date)),

  getMonthlySales: (year, month) =>
    getDocuments(
      COLLECTIONS.SALES,
      where('year', '==', year),
      where('month', '==', month),
    ),

  recordSale: (data) =>
    addDocument(COLLECTIONS.SALES, data),
};
