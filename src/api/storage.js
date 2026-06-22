import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';
import { storage } from './firebase';

export const uploadFile = async (path, file) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

export const getFileUrl = (path) => getDownloadURL(ref(storage, path));

export const deleteFile = (path) => deleteObject(ref(storage, path));

export const listFiles = (path) => listAll(ref(storage, path));
