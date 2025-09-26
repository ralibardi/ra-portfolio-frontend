import type React from 'react';
import { useEffect, useState } from 'react';
import styles from './PWAUpdate.module.scss';

interface PWAUpdateProps {
  registration?: ServiceWorkerRegistration;
}

const PWAUpdate: React.FC<PWAUpdateProps> = ({ registration }) => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (registration?.waiting) {
      setShowUpdate(true);
    }
  }, [registration]);

  const handleUpdate = async () => {
    if (!registration?.waiting) return;

    setIsUpdating(true);

    // Send message to service worker to skip waiting
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // Listen for controlling change and reload
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <div className={styles.updateBanner}>
      <div className={styles.content}>
        <span className={styles.message}>A new version is available!</span>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.updateBtn}
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
          <button type="button" className={styles.dismissBtn} onClick={handleDismiss}>
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAUpdate;
