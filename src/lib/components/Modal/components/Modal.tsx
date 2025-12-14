import cn from 'classnames';
import { memo, useCallback, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { ModalProps } from '../../types';
import styles from '../assets/Modal.module.scss';

/**
 * Modal Component
 *
 * A modal overlay component with focus trapping, scroll prevention,
 * and accessibility features. Renders content in a portal for proper
 * z-index stacking.
 *
 * @example
 * ```tsx
 * <Modal isOpen={isOpen} onClose={handleClose}>
 *   <h2>Modal Title</h2>
 *   <p>Modal content goes here</p>
 * </Modal>
 * ```
 */
const Modal = memo(function Modal({
  isOpen,
  onClose,
  children,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
}: ModalProps) {
  const modalId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const firstFocusableRef = useRef<HTMLElement | null>(null);
  const lastFocusableRef = useRef<HTMLElement | null>(null);

  // Get all focusable elements within the modal
  const getFocusableElements = useCallback(() => {
    if (!modalRef.current) return [];
    const focusableSelectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');
    return Array.from(modalRef.current.querySelectorAll<HTMLElement>(focusableSelectors));
  }, []);

  // Update focusable element refs
  const updateFocusableRefs = useCallback(() => {
    const focusableElements = getFocusableElements();
    firstFocusableRef.current = focusableElements[0] || null;
    lastFocusableRef.current = focusableElements[focusableElements.length - 1] || null;
  }, [getFocusableElements]);

  // Handle escape key press
  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape) {
        event.preventDefault();
        onClose();
      }
    },
    [closeOnEscape, onClose],
  );

  // Handle tab key for focus trapping
  const handleTabKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      updateFocusableRefs();
      const focusableElements = getFocusableElements();

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey) {
        // Shift + Tab: move focus backwards
        if (document.activeElement === firstFocusableRef.current) {
          event.preventDefault();
          lastFocusableRef.current?.focus();
        }
      } else if (document.activeElement === lastFocusableRef.current) {
        // Tab: move focus forwards - wrap to first element
        event.preventDefault();
        firstFocusableRef.current?.focus();
      }
    },
    [getFocusableElements, updateFocusableRefs],
  );

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      handleEscapeKey(event);
      handleTabKey(event);
    },
    [handleEscapeKey, handleTabKey],
  );

  // Handle overlay click
  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick && event.target === event.currentTarget) {
        onClose();
      }
    },
    [closeOnOverlayClick, onClose],
  );

  // Prevent click propagation from modal content
  const handleContentClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  }, []);

  // Handle body scroll prevention and focus management
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Prevent body scroll
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      // Add keyboard event listener
      document.addEventListener('keydown', handleKeyDown);

      // Focus the modal or first focusable element
      requestAnimationFrame(() => {
        updateFocusableRefs();
        if (firstFocusableRef.current) {
          firstFocusableRef.current.focus();
        } else {
          modalRef.current?.focus();
        }
      });

      return () => {
        // Restore body scroll
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;

        // Remove keyboard event listener
        document.removeEventListener('keydown', handleKeyDown);

        // Restore focus to the previously focused element
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }

    // Return undefined when modal is not open
    return undefined;
  }, [isOpen, handleKeyDown, updateFocusableRefs]);

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  const modalContent = (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Keyboard events handled via document listener
    // biome-ignore lint/a11y/noStaticElementInteractions: Overlay click is intentional for closing modal
    <div className={styles.overlay} onClick={handleOverlayClick} data-testid="modal-overlay">
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Click prevents propagation, keyboard handled by document */}
      <div
        ref={modalRef}
        className={cn(styles.modal)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        id={modalId}
        tabIndex={-1}
        onClick={handleContentClick}
        data-testid="modal"
      >
        {children}
      </div>
    </div>
  );

  // Render in portal for proper z-index stacking
  return createPortal(modalContent, document.body);
});

Modal.displayName = 'Modal';

export default Modal;
