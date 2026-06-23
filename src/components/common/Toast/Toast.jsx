import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './Toast.css';

const ICONS = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };

const ToastItem = ({ toast, onRemove }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setExiting(true), toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast.duration]);

  const handleClose = () => setExiting(true);

  return (
    <div
      className={`toast toast--${toast.type}${exiting ? ' toast--exiting' : ''}`}
      onAnimationEnd={() => exiting && onRemove(toast.id)}
    >
      <span className="toast__icon">{ICONS[toast.type]}</span>
      <div className="toast__body">
        {toast.title && <p className="toast__title">{toast.title}</p>}
        <p className="toast__message">{toast.message}</p>
      </div>
      <button className="toast__close" onClick={handleClose}>×</button>
    </div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) =>
  createPortal(
    <div className="toast-container">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>,
    document.body,
  );
