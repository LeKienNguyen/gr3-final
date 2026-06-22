export const getFileExtension = (filename) =>
  filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);

export const generateFileName = (originalName) => {
  const ext = getFileExtension(originalName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}.${ext}`;
};

export const isValidFileType = (file, allowedTypes) =>
  allowedTypes.includes(file.type);

export const isValidFileSize = (file, maxSizeMB) =>
  file.size <= maxSizeMB * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_FILE_SIZE_MB = 5;
