import { getDocuments, addDocument, updateDocument, deleteDocument, where, orderBy } from '@/api/firestore';
import { COLLECTIONS, STOCK_STATUS, LOW_STOCK_THRESHOLD } from '@/constants';

export const inventoryService = {
  getIngredients: () =>
    getDocuments(COLLECTIONS.INGREDIENTS, orderBy('name')),

  getIngredientById: (id) =>
    getDocuments(COLLECTIONS.INGREDIENTS, where('__name__', '==', id)),

  addIngredient: (data) =>
    addDocument(COLLECTIONS.INGREDIENTS, data),

  updateIngredient: (id, data) =>
    updateDocument(COLLECTIONS.INGREDIENTS, id, data),

  deleteIngredient: (id) =>
    deleteDocument(COLLECTIONS.INGREDIENTS, id),

  getLowStockItems: () =>
    getDocuments(COLLECTIONS.INGREDIENTS, where('status', '==', STOCK_STATUS.LOW_STOCK)),

  getStockMovements: () =>
    getDocuments(COLLECTIONS.STOCK_MOVEMENTS, orderBy('createdAt', 'desc')),

  addStockMovement: (data) =>
    addDocument(COLLECTIONS.STOCK_MOVEMENTS, data),

  getSuppliers: () =>
    getDocuments(COLLECTIONS.SUPPLIERS, orderBy('name')),

  addSupplier: (data) =>
    addDocument(COLLECTIONS.SUPPLIERS, data),

  updateSupplier: (id, data) =>
    updateDocument(COLLECTIONS.SUPPLIERS, id, data),

  deleteSupplier: (id) =>
    deleteDocument(COLLECTIONS.SUPPLIERS, id),
};
