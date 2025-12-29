'use client';

import { useToast } from '@contexts/toast-context';
import React from 'react';
import styles from '../assets/toast.module.scss';

const ToastContainer: React.FC = () => {
  const { toasts, remove } = useToast();

  return (
    <div className={styles.container} aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <output key={t.id} className={styles.toast} data-type={t.type}>
          <span className={styles.message}>{t.message}</span>
          <button
            type="button"
            className={styles.close}
            aria-label="Dismiss"
            onClick={() => remove(t.id)}
          >
            ×
          </button>
        </output>
      ))}
    </div>
  );
};

export default React.memo(ToastContainer);
