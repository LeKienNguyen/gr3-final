import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

export const Modal = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  footer,
}) => {
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={`modal modal--${size}`}>
        <div className="modal__header">
          <h2 id="modal-title" className="modal__title">{title}</h2>
          <button
            className="modal__close"
            onClick={onClose}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>
        <div className="modal__body">
          {children}
        </div>
        {footer && (
          <div className="modal__footer">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};
