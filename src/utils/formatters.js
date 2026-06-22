export const formatCurrency = (amount, locale = 'vi-VN', currency = 'VND') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);

export const formatNumber = (num, locale = 'vi-VN') =>
  new Intl.NumberFormat(locale).format(num);

export const formatPercent = (value, decimals = 1) =>
  `${(value * 100).toFixed(decimals)}%`;

export const truncate = (str, length = 50) =>
  str.length > length ? `${str.slice(0, length)}...` : str;

export const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
