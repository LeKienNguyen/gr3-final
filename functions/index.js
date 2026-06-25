import { onCall, HttpsError } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();
const auth = getAuth();

function removeVietnameseAccents(str) {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function nameToEmail(name) {
  return removeVietnameseAccents(name)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

async function generateUniqueEmail(name) {
  const base = nameToEmail(name);
  const domain = "guiguibbq.com";
  let email = `${base}@${domain}`;

  try {
    await auth.getUserByEmail(email);
  } catch (err) {
    if (err.code === "auth/user-not-found") return email;
    throw err;
  }

  for (let i = 1; i <= 99; i++) {
    email = `${base}${String(i).padStart(2, "0")}@${domain}`;
    try {
      await auth.getUserByEmail(email);
    } catch (err) {
      if (err.code === "auth/user-not-found") return email;
      throw err;
    }
  }
  throw new HttpsError("already-exists", "Không thể tạo email duy nhất");
}

async function generateEmployeeId() {
  const counterRef = db.collection("counters").doc("employees");
  const result = await db.runTransaction(async (t) => {
    const doc = await t.get(counterRef);
    const current = doc.exists ? doc.data().lastId : 0;
    const next = current + 1;
    t.set(counterRef, { lastId: next }, { merge: true });
    return next;
  });
  return `EMP${String(result).padStart(4, "0")}`;
}

export const createEmployee = onCall(
  { region: "asia-southeast1" },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Yêu cầu đăng nhập");
    }

    const callerUid = request.auth.uid;
    const callerSnap = await db.collection("users").where("uid", "==", callerUid).get();
    if (callerSnap.empty) {
      throw new HttpsError("permission-denied", "Không tìm thấy tài khoản người dùng");
    }
    const callerRole = callerSnap.docs[0].data().role;
    if (callerRole !== "manager") {
      throw new HttpsError("permission-denied", "Chỉ Quản lý mới có quyền tạo nhân viên");
    }

    const { name, phone, position, employmentType } = request.data;

    if (!name || !name.trim()) {
      throw new HttpsError("invalid-argument", "Vui lòng nhập họ tên");
    }
    if (!phone || !phone.trim()) {
      throw new HttpsError("invalid-argument", "Vui lòng nhập số điện thoại");
    }
    if (!position || !position.trim()) {
      throw new HttpsError("invalid-argument", "Vui lòng chọn vị trí");
    }

    const email = await generateUniqueEmail(name.trim());
    const defaultPassword = "Guigui@123";
    const employeeId = await generateEmployeeId();

    const userRecord = await auth.createUser({
      email,
      password: defaultPassword,
      displayName: name.trim(),
    });

    const userData = {
      uid: userRecord.uid,
      employeeId,
      name: name.trim(),
      displayName: name.trim(),
      email,
      phone: phone.trim(),
      position: position.trim(),
      employmentType: employmentType || "full-time",
      role: "employee",
      status: "active",
      mustChangePassword: true,
      createdBy: callerUid,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await db.collection("users").doc(userRecord.uid).set(userData);

    await db.collection("employees").doc(userRecord.uid).set({
      name: name.trim(),
      email,
      phone: phone.trim(),
      position: position.trim(),
      employmentType: employmentType || "full-time",
      role: "employee",
      status: "active",
      employeeId,
      uid: userRecord.uid,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      employeeId,
      email,
      defaultPassword,
      uid: userRecord.uid,
      name: name.trim(),
    };
  }
);
