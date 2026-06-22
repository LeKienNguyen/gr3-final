import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export const getCollection = (collectionName) => collection(db, collectionName);

export const getDocument = (collectionName, docId) =>
  getDoc(doc(db, collectionName, docId));

export const getDocuments = (collectionName, ...queryConstraints) =>
  getDocs(query(collection(db, collectionName), ...queryConstraints));

export const addDocument = (collectionName, data) =>
  addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

export const updateDocument = (collectionName, docId, data) =>
  updateDoc(doc(db, collectionName, docId), {
    ...data,
    updatedAt: serverTimestamp(),
  });

export const deleteDocument = (collectionName, docId) =>
  deleteDoc(doc(db, collectionName, docId));

export const subscribeToCollection = (collectionName, callback, ...queryConstraints) =>
  onSnapshot(query(collection(db, collectionName), ...queryConstraints), callback);

export const subscribeToDocument = (collectionName, docId, callback) =>
  onSnapshot(doc(db, collectionName, docId), callback);

export { where, orderBy, limit, serverTimestamp };
