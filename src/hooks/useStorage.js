import { useState, useCallback } from 'react';
import { uploadFile, deleteFile, getFileUrl } from '@/api/storage';

export const useStorage = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const upload = useCallback(async (path, file) => {
    setUploading(true);
    setProgress(0);
    setError(null);
    try {
      const url = await uploadFile(path, file);
      setProgress(100);
      return url;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const remove = useCallback(async (path) => {
    setError(null);
    try {
      await deleteFile(path);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  const getUrl = useCallback(async (path) => {
    try {
      return await getFileUrl(path);
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  return { uploading, progress, error, upload, remove, getUrl };
};
