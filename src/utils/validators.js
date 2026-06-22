export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPhone = (phone) =>
  /^(\+84|0)(3|5|7|8|9)\d{8}$/.test(phone);

export const isStrongPassword = (password) =>
  password.length >= 8 &&
  /[A-Z]/.test(password) &&
  /[a-z]/.test(password) &&
  /\d/.test(password);

export const isRequired = (value) =>
  value !== null && value !== undefined && String(value).trim() !== '';

export const isPositiveNumber = (value) =>
  typeof value === 'number' && value > 0;

export const isWithinRange = (value, min, max) =>
  value >= min && value <= max;
