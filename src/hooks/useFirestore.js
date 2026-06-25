import { useState, useCallback } from 'react';
import {
  getDocuments,
  getDocument,
  addDocument,
  updateDocument,
  deleteDocument,
  subscribeToCollection,
} from '@/api/firestore';

export const useFirestore = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async (...queryConstraints) => {
    setLoading(true);
    setError(null);
    try {
      const snapshot = await getDocuments(collectionName, ...queryConstraints);
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setData(docs);
      return docs;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const fetchOne = useCallback(async (docId) => {
    setLoading(true);
    setError(null);
    try {
      const docSnap = await getDocument(collectionName, docId);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const add = useCallback(async (docData) => {
    setError(null);
    try {
      const docRef = await addDocument(collectionName, docData);
      return docRef.id;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [collectionName]);

  const update = useCallback(async (docId, docData) => {
    setError(null);
    try {
      await updateDocument(collectionName, docId, docData);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [collectionName]);

  const remove = useCallback(async (docId) => {
    setError(null);
    try {
      await deleteDocument(collectionName, docId);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [collectionName]);

  const subscribe = useCallback((...queryConstraints) => {
    setLoading(true);
    return subscribeToCollection(
      collectionName,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData(docs);
        setLoading(false);
      },
      ...queryConstraints,
    );
  }, [collectionName]);

  return { data, loading, error, fetchAll, fetchOne, add, update, remove, subscribe };
};
