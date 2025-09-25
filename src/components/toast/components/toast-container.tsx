import React from 'react';
import { useToast } from '@contexts/toast-context';
import styles from '../assets/toast.module.scss';

const ToastContainer: React.FC = () => {
  const { toasts, remove } = useToast();

  return (
    <div className={styles.container} aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={styles.toast}
          data-type={t.type}
          role="status"
        >
          <span className={styles.message}>{t.message}</span>
          <button
            className={styles.close}
            aria-label="Dismiss"
            onClick={() => remove(t.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default React.memo(ToastContainer);

