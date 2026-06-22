export const formatDate = (date, locale = 'vi-VN') =>
  new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date));

export const formatDateTime = (date, locale = 'vi-VN') =>
  new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));

export const getStartOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getEndOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const getStartOfMonth = (date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

export const getEndOfMonth = (date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

export const getDaysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
};

export const toFirestoreTimestamp = (date) => new Date(date);
