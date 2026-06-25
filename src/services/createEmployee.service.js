import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '@/api/firebase';
import firebaseConfig from '@/config/firebase.config';

function removeVietnameseAccents(str) {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function nameToEmail(name) {
  return removeVietnameseAccents(name)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

export function previewEmail(name) {
  if (!name || !name.trim()) return '';
  return `${nameToEmail(name)}@guiguibbq.com`;
}

async function isEmailTaken(email) {
  const tempApp = initializeApp(firebaseConfig, '__emailCheck__' + Date.now());
  const tempAuth = getAuth(tempApp);
  try {
    await createUserWithEmailAndPassword(tempAuth, email, '__checkonly__' + Date.now());
    return false;
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') return true;
    return false;
  } finally {
    try { await signOut(tempAuth); } catch {}
    try { await deleteApp(tempApp); } catch {}
  }
}

async function generateUniqueEmail(name) {
  const base = nameToEmail(name);
  const domain = 'guiguibbq.com';

  let email = `${base}@${domain}`;
  let taken = await isEmailTakenFast(email);
  if (!taken) return email;

  for (let i = 1; i <= 99; i++) {
    email = `${base}${String(i).padStart(2, '0')}@${domain}`;
    taken = await isEmailTakenFast(email);
    if (!taken) return email;
  }
  throw new Error('Không thể tạo email duy nhất cho tên này');
}

async function isEmailTakenFast(email) {
  const { fetchSignInMethodsForEmail } = await import('firebase/auth');
  const { auth } = await import('@/api/firebase');
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    return methods.length > 0;
  } catch {
    return false;
  }
}

async function generateEmployeeId() {
  const counterRef = doc(db, 'counters', 'employees');
  const result = await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);
    const current = counterDoc.exists() ? counterDoc.data().lastId : 0;
    const next = current + 1;
    transaction.set(counterRef, { lastId: next }, { merge: true });
    return next;
  });
  return `EMP${String(result).padStart(4, '0')}`;
}

export async function createEmployeeAccount({ name, phone, position, employmentType, createdBy }) {
  const email = await generateUniqueEmail(name.trim());
  const defaultPassword = 'Guigui@123';
  const employeeId = await generateEmployeeId();

  const secondaryApp = initializeApp(firebaseConfig, '__createUser__' + Date.now());
  const secondaryAuth = getAuth(secondaryApp);

  try {
    const credential = await createUserWithEmailAndPassword(secondaryAuth, email, defaultPassword);
    const uid = credential.user.uid;

    await updateProfile(credential.user, { displayName: name.trim() });
    await signOut(secondaryAuth);

    const userData = {
      uid,
      employeeId,
      name: name.trim(),
      displayName: name.trim(),
      email,
      phone: phone.trim(),
      position: position.trim(),
      employmentType: employmentType || 'full-time',
      role: 'employee',
      status: 'active',
      mustChangePassword: true,
      createdBy: createdBy || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', uid), userData);

    await setDoc(doc(db, 'employees', uid), {
      name: name.trim(),
      email,
      phone: phone.trim(),
      position: position.trim(),
      employmentType: employmentType || 'full-time',
      role: 'employee',
      status: 'active',
      employeeId,
      uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      uid,
      employeeId,
      email,
      defaultPassword,
      name: name.trim(),
    };
  } finally {
    try { await deleteApp(secondaryApp); } catch {}
  }
}
