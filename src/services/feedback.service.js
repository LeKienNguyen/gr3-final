import { getDocuments, addDocument, orderBy } from '@/api/firestore';
import { COLLECTIONS } from '@/constants';

export const feedbackService = {
  getFeedbacks: () =>
    getDocuments(COLLECTIONS.FEEDBACK, orderBy('createdAt', 'desc')),

  submitFeedback: (data) =>
    addDocument(COLLECTIONS.FEEDBACK, data),

  generateFeedbackUrl: (restaurantId) =>
    `${window.location.origin}/feedback-form/${restaurantId}`,
};
