import cn from 'classnames';
import { memo, useId } from 'react';
import type { DialogProps } from '../../types';
import styles from '../assets/Dialog.module.scss';
import Modal from './Modal';

/**
 * Dialog Component
 *
 * A structured modal dialog with header, body, and footer sections.
 * Extends the Modal component with predefined layout and size variants.
 *
 * @example
 * ```tsx
 * <Dialog
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   title="Confirm Action"
 *   footer={
 *     <>
 *       <Button variant="ghost" onClick={handleClose}>Cancel</Button>
 *       <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
 *     </>
 *   }
 * >
 *   <p>Are you sure you want to proceed?</p>
 * </Dialog>
 * ```
 */
const Dialog = memo(function Dialog({
  isOpen,
  onClose,
  title,
  children,
  footer,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  size = 'medium',
}: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={closeOnOverlayClick}
      closeOnEscape={closeOnEscape}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div className={cn(styles.dialog, styles[`dialog--${size}`])} data-testid="dialog">
        {/* Header */}
        <header className={styles.header} data-testid="dialog-header">
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close dialog"
            data-testid="dialog-close-button"
          >
            <svg
              className={styles.closeIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        {/* Body */}
        <div id={descriptionId} className={styles.body} data-testid="dialog-body">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <footer className={styles.footer} data-testid="dialog-footer">
            {footer}
          </footer>
        )}
      </div>
    </Modal>
  );
});

Dialog.displayName = 'Dialog';

export default Dialog;
