import { useEffect } from 'react';
import { CloseIcon } from './Icons';
import './Modal.css';

export default function Modal({ isOpen, onClose, title, subtitle, children, size = 'md' }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="tf-modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`tf-modal tf-modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tf-modal-title"
      >
        <div className="tf-modal__header">
          <div>
            <h2 id="tf-modal-title" className="tf-modal__title">
              {title}
            </h2>
            {subtitle && <p className="tf-modal__subtitle">{subtitle}</p>}
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            <CloseIcon size={18} />
          </button>
        </div>
        <div className="tf-modal__body">{children}</div>
      </div>
    </div>
  );
}

