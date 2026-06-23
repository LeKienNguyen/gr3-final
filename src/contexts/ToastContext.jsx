import { createContext, useState, useCallback, useMemo } from 'react';
import { ToastContainer } from '@/components/common/Toast';

export const ToastContext = createContext(null);

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type, message, title, duration) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, message, title, duration }]);
    return id;
  }, []);

  const value = useMemo(() => ({
    success: (message, title) => addToast('success', message, title),
    error: (message, title) => addToast('error', message, title, 5000),
    warning: (message, title) => addToast('warning', message, title),
    info: (message, title) => addToast('info', message, title),
  }), [addToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};
