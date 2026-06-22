import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './firebase';

export const registerUser = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const loginUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const logoutUser = () => signOut(auth);

export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

export const updateUserProfile = (user, data) => updateProfile(user, data);

export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);
