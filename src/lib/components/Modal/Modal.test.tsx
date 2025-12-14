/**
 * Modal and Dialog Component Property-Based Tests
 *
 * These tests verify the correctness properties of the Modal and Dialog components
 * using fast-check for property-based testing.
 *
 * @module lib/components/Modal/Modal.test
 */

import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import { useId } from 'react';
import { labelTextArb, PBT_CONFIG } from '../../testing/property-testing';
import { act, fireEvent, renderComponent, screen, waitFor } from '../../testing/render-utils';
import { Dialog, Modal } from './index';

// Dialog size arbitrary
const dialogSizeArb = fc.constantFrom('small', 'medium', 'large') as fc.Arbitrary<
  'small' | 'medium' | 'large'
>;

describe('Modal Component Property Tests', () => {
  // Clean up any portals after each test
  beforeEach(() => {
    // Reset body styles
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  afterEach(() => {
    // Clean up portals
    const portals = document.body.querySelectorAll('[data-testid="modal-overlay"]');
    portals.forEach((portal) => {
      portal.remove();
    });
  });

  // ============================================================================
  // Property 32: Modal rendering and scroll prevention
  // Feature: reusable-component-library, Property 32: Modal rendering and scroll prevention
  // ============================================================================
  describe('Property 32: Modal rendering and scroll prevention', () => {
    /**
     * **Validates: Requirements 5.1**
     *
     * For any Modal component with isOpen=true, an overlay should be rendered,
     * content should be centered, and body scrolling should be prevented.
     */
    test('Modal should render overlay and prevent body scroll when open', () => {
      fc.assert(
        fc.property(labelTextArb, (content) => {
          const handleClose = jest.fn();
          const { unmount } = renderComponent(
            <Modal isOpen={true} onClose={handleClose}>
              <div data-testid="modal-content">{content}</div>
            </Modal>,
          );

          // Overlay should be rendered
          const overlay = screen.getByTestId('modal-overlay');
          expect(overlay).toBeInTheDocument();

          // Modal should be rendered
          const modal = screen.getByTestId('modal');
          expect(modal).toBeInTheDocument();

          // Body scroll should be prevented
          expect(document.body.style.overflow).toBe('hidden');

          // Content should be rendered
          const modalContent = screen.getByTestId('modal-content');
          expect(modalContent).toBeInTheDocument();

          unmount();
        }),
        PBT_CONFIG,
      );
    });

    test('Modal should not render when isOpen is false', () => {
      const handleClose = jest.fn();
      renderComponent(
        <Modal isOpen={false} onClose={handleClose}>
          <div data-testid="modal-content">Content</div>
        </Modal>,
      );

      expect(screen.queryByTestId('modal-overlay')).not.toBeInTheDocument();
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  // ============================================================================
  // Property 33: Overlay click behavior
  // Feature: reusable-component-library, Property 33: Overlay click behavior
  // ============================================================================
  describe('Property 33: Overlay click behavior', () => {
    /**
     * **Validates: Requirements 5.2**
     *
     * For any Modal component with closeOnOverlayClick=true, clicking the overlay
     * should call the onClose handler; with closeOnOverlayClick=false, clicking
     * the overlay should not close the modal.
     */
    test('Modal should close on overlay click when closeOnOverlayClick is true', () => {
      fc.assert(
        fc.property(fc.boolean(), (closeOnOverlayClick) => {
          const handleClose = jest.fn();
          const { unmount } = renderComponent(
            <Modal isOpen={true} onClose={handleClose} closeOnOverlayClick={closeOnOverlayClick}>
              <div data-testid="modal-content">Content</div>
            </Modal>,
          );

          const overlay = screen.getByTestId('modal-overlay');
          fireEvent.click(overlay);

          if (closeOnOverlayClick) {
            expect(handleClose).toHaveBeenCalledTimes(1);
          } else {
            expect(handleClose).not.toHaveBeenCalled();
          }

          unmount();
        }),
        PBT_CONFIG,
      );
    });

    test('Clicking modal content should not trigger close', () => {
      const handleClose = jest.fn();
      const { unmount } = renderComponent(
        <Modal isOpen={true} onClose={handleClose} closeOnOverlayClick={true}>
          <div data-testid="modal-content">Content</div>
        </Modal>,
      );

      const modal = screen.getByTestId('modal');
      fireEvent.click(modal);

      expect(handleClose).not.toHaveBeenCalled();

      unmount();
    });
  });

  // ============================================================================
  // Property 34: Escape key behavior
  // Feature: reusable-component-library, Property 34: Escape key behavior
  // ============================================================================
  describe('Property 34: Escape key behavior', () => {
    /**
     * **Validates: Requirements 5.3**
     *
     * For any Modal component with closeOnEscape=true, pressing Escape should
     * call the onClose handler; with closeOnEscape=false, pressing Escape should
     * not close the modal.
     */
    test('Modal should close on Escape key when closeOnEscape is true', async () => {
      const handleClose = jest.fn();
      const { unmount } = renderComponent(
        <Modal isOpen={true} onClose={handleClose} closeOnEscape={true}>
          <div data-testid="modal-content">Content</div>
        </Modal>,
      );

      // Wait for modal to be rendered and event listener to be attached
      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      // Simulate Escape key press
      await act(async () => {
        fireEvent.keyDown(document, { key: 'Escape' });
      });

      expect(handleClose).toHaveBeenCalledTimes(1);

      unmount();
    });

    test('Modal should NOT close on Escape key when closeOnEscape is false', async () => {
      const handleClose = jest.fn();
      const { unmount } = renderComponent(
        <Modal isOpen={true} onClose={handleClose} closeOnEscape={false}>
          <div data-testid="modal-content">Content</div>
        </Modal>,
      );

      // Wait for modal to be rendered
      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      // Simulate Escape key press
      await act(async () => {
        fireEvent.keyDown(document, { key: 'Escape' });
      });

      expect(handleClose).not.toHaveBeenCalled();

      unmount();
    });
  });

  // ============================================================================
  // Property 35: Modal focus trapping
  // Feature: reusable-component-library, Property 35: Modal focus trapping
  // ============================================================================
  describe('Property 35: Modal focus trapping', () => {
    /**
     * **Validates: Requirements 5.4**
     *
     * For any open Modal component, pressing Tab should cycle focus only through
     * focusable elements within the modal content.
     */
    test('Modal should trap focus within modal content', async () => {
      const handleClose = jest.fn();
      const { unmount } = renderComponent(
        <Modal isOpen={true} onClose={handleClose}>
          <div>
            <button type="button" data-testid="first-button">
              First
            </button>
            <button type="button" data-testid="second-button">
              Second
            </button>
            <button type="button" data-testid="third-button">
              Third
            </button>
          </div>
        </Modal>,
      );

      // Wait for modal to be rendered
      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      const firstButton = screen.getByTestId('first-button');
      const thirdButton = screen.getByTestId('third-button');

      // Focus should start on first focusable element
      await waitFor(() => {
        expect(document.activeElement).toBe(firstButton);
      });

      // Tab from last element should wrap to first
      thirdButton.focus();
      await act(async () => {
        fireEvent.keyDown(document, { key: 'Tab' });
      });

      await waitFor(() => {
        expect(document.activeElement).toBe(firstButton);
      });

      // Shift+Tab from first element should wrap to last
      firstButton.focus();
      await act(async () => {
        fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
      });

      await waitFor(() => {
        expect(document.activeElement).toBe(thirdButton);
      });

      unmount();
    });
  });

  // ============================================================================
  // Property 36: Modal focus restoration
  // Feature: reusable-component-library, Property 36: Modal focus restoration
  // ============================================================================
  describe('Property 36: Modal focus restoration', () => {
    /**
     * **Validates: Requirements 5.5**
     *
     * For any Modal component that closes, focus should return to the element
     * that was focused before the modal opened.
     */
    test('Modal should restore focus to trigger element on close', async () => {
      const TestComponent = () => {
        const [isOpen, setIsOpen] = React.useState(false);
        return (
          <>
            <button type="button" data-testid="trigger-button" onClick={() => setIsOpen(true)}>
              Open Modal
            </button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <button type="button" data-testid="close-button" onClick={() => setIsOpen(false)}>
                Close
              </button>
            </Modal>
          </>
        );
      };

      const { unmount } = renderComponent(<TestComponent />);

      const triggerButton = screen.getByTestId('trigger-button');

      // Focus and click the trigger button
      triggerButton.focus();
      expect(document.activeElement).toBe(triggerButton);

      await act(async () => {
        fireEvent.click(triggerButton);
      });

      // Wait for modal to open
      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      // Close the modal
      const closeButton = screen.getByTestId('close-button');
      await act(async () => {
        fireEvent.click(closeButton);
      });

      // Wait for modal to close and focus to be restored
      await waitFor(() => {
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(document.activeElement).toBe(triggerButton);
      });

      unmount();
    });
  });

  // ============================================================================
  // Property 38: Modal ARIA attributes
  // Feature: reusable-component-library, Property 38: Modal ARIA attributes
  // ============================================================================
  describe('Property 38: Modal ARIA attributes', () => {
    /**
     * **Validates: Requirements 5.7**
     *
     * For any open Modal component, the modal should have role="dialog" and
     * aria-modal="true" attributes.
     */
    test('Modal should have proper ARIA attributes', () => {
      fc.assert(
        fc.property(labelTextArb, (content) => {
          const TestModalContent = () => {
            const titleId = useId();
            const descriptionId = useId();
            
            return (
              <>
                <h2 id={titleId}>Title</h2>
                <p id={descriptionId}>{content}</p>
              </>
            );
          };

          const handleClose = jest.fn();
          const titleId = 'modal-title-test';
          const descriptionId = 'modal-description-test';
          
          const { unmount } = renderComponent(
            <Modal
              isOpen={true}
              onClose={handleClose}
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
            >
              <TestModalContent />
            </Modal>,
          );

          const modal = screen.getByTestId('modal');

          // Check ARIA attributes
          expect(modal).toHaveAttribute('role', 'dialog');
          expect(modal).toHaveAttribute('aria-modal', 'true');
          expect(modal).toHaveAttribute('aria-labelledby', titleId);
          expect(modal).toHaveAttribute('aria-describedby', descriptionId);

          unmount();
        }),
        PBT_CONFIG,
      );
    });
  });
});

// Import React for the focus restoration test
import React from 'react';

describe('Dialog Component Property Tests', () => {
  // Clean up any portals after each test
  beforeEach(() => {
    // Reset body styles
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  afterEach(() => {
    // Clean up portals
    const portals = document.body.querySelectorAll('[data-testid="modal-overlay"]');
    portals.forEach((portal) => {
      portal.remove();
    });
  });

  // ============================================================================
  // Property 37: Dialog structure
  // Feature: reusable-component-library, Property 37: Dialog structure
  // ============================================================================
  describe('Property 37: Dialog structure', () => {
    /**
     * **Validates: Requirements 5.6**
     *
     * For any Dialog component, the rendered output should contain distinct
     * header, body, and footer sections.
     */
    test('Dialog should render header, body, and footer sections', () => {
      fc.assert(
        fc.property(
          fc.record({
            title: labelTextArb,
            content: labelTextArb,
            size: dialogSizeArb,
          }),
          ({ title, content, size }) => {
            const handleClose = jest.fn();
            const { unmount } = renderComponent(
              <Dialog
                isOpen={true}
                onClose={handleClose}
                title={title}
                size={size}
                footer={<button type="button">Footer Button</button>}
              >
                <p>{content}</p>
              </Dialog>,
            );

            // Dialog should be rendered
            const dialog = screen.getByTestId('dialog');
            expect(dialog).toBeInTheDocument();

            // Header should be rendered with title
            const header = screen.getByTestId('dialog-header');
            expect(header).toBeInTheDocument();

            // Body should be rendered with content
            const body = screen.getByTestId('dialog-body');
            expect(body).toBeInTheDocument();

            // Footer should be rendered
            const footer = screen.getByTestId('dialog-footer');
            expect(footer).toBeInTheDocument();

            // Close button should be in header
            const closeButton = screen.getByTestId('dialog-close-button');
            expect(closeButton).toBeInTheDocument();

            unmount();
          },
        ),
        PBT_CONFIG,
      );
    });

    test('Dialog should render without footer when not provided', () => {
      fc.assert(
        fc.property(
          fc.record({
            title: labelTextArb,
            content: labelTextArb,
          }),
          ({ title, content }) => {
            const handleClose = jest.fn();
            const { unmount } = renderComponent(
              <Dialog isOpen={true} onClose={handleClose} title={title}>
                <p>{content}</p>
              </Dialog>,
            );

            // Dialog should be rendered
            expect(screen.getByTestId('dialog')).toBeInTheDocument();

            // Header and body should be rendered
            expect(screen.getByTestId('dialog-header')).toBeInTheDocument();
            expect(screen.getByTestId('dialog-body')).toBeInTheDocument();

            // Footer should NOT be rendered
            expect(screen.queryByTestId('dialog-footer')).not.toBeInTheDocument();

            unmount();
          },
        ),
        PBT_CONFIG,
      );
    });

    test('Dialog size variants should apply correct CSS classes', () => {
      fc.assert(
        fc.property(dialogSizeArb, (size) => {
          const handleClose = jest.fn();
          const { unmount } = renderComponent(
            <Dialog isOpen={true} onClose={handleClose} title="Test" size={size}>
              <p>Content</p>
            </Dialog>,
          );

          const dialog = screen.getByTestId('dialog');
          expect(dialog).toHaveClass(`dialog--${size}`);

          unmount();
        }),
        PBT_CONFIG,
      );
    });

    test('Dialog close button should call onClose', async () => {
      const handleClose = jest.fn();
      const { unmount } = renderComponent(
        <Dialog isOpen={true} onClose={handleClose} title="Test">
          <p>Content</p>
        </Dialog>,
      );

      const closeButton = screen.getByTestId('dialog-close-button');

      await act(async () => {
        fireEvent.click(closeButton);
      });

      expect(handleClose).toHaveBeenCalledTimes(1);

      unmount();
    });
  });
});
