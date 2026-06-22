import { getDocuments, addDocument, orderBy } from '@/api/firestore';
import { COLLECTIONS } from '@/constants';

export const forecastingService = {
  getForecasts: () =>
    getDocuments(COLLECTIONS.FORECASTS, orderBy('createdAt', 'desc')),

  saveForecast: (data) =>
    addDocument(COLLECTIONS.FORECASTS, data),

  getDemandPrediction: async () => {
    // AI prediction logic will be implemented here
    return [];
  },

  getPurchaseRecommendations: async () => {
    // Purchase recommendation logic will be implemented here
    return [];
  },

  getWasteAnalysis: async () => {
    // Waste analysis logic will be implemented here
    return {};
  },
};
