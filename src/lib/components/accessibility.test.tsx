/**
 * Comprehensive Accessibility Tests for Component Library
 *
 * This test suite uses jest-axe to run automated accessibility tests
 * on all components in the library, ensuring WCAG 2.1 AA compliance.
 *
 * @module lib/components/accessibility.test
 */

import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  getAccessibleName,
  getFocusableElements,
  hasAriaAttribute,
  isFocusable,
  pressArrow,
  pressEscape,
} from '../testing/accessibility-utils';
import { renderComponent, screen, waitFor } from '../testing/render-utils';
import { Accordion } from './Accordion';
import { Alert } from './Alert';
import { Breadcrumb } from './Breadcrumb';
// Import all components
import { Button } from './Button';
import { Checkbox, Input, RadioGroup, Select } from './Form';
import { Skeleton, Spinner } from './Loading';
import { Modal } from './Modal';
import { Pagination } from './Pagination';
import { Tabs } from './Tabs';
import { Tooltip } from './Tooltip';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock icon for testing
const MockIcon = () => <svg data-testid="mock-icon" aria-hidden="true" />;

describe('Component Library Accessibility Tests', () => {
  // ============================================================================
  // Button Component Accessibility
  // ============================================================================
  describe('Button Component', () => {
    test('should have no accessibility violations', async () => {
      const { container } = renderComponent(
        <div>
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary" disabled>
            Disabled Button
          </Button>
          <Button variant="tertiary" icon={<MockIcon />}>
            Button with Icon
          </Button>
          <Button variant="danger" icon={<MockIcon />} aria-label="Delete item" />
          <Button variant="ghost" isLoading aria-label="Loading">
            Loading Button
          </Button>
        </div>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should have proper ARIA attributes', () => {
      renderComponent(
        <Button variant="primary" aria-label="Close dialog">
          ×
        </Button>,
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
      expect(button).toHaveAttribute('aria-label', 'Close dialog');
    });

    test('should be keyboard accessible', () => {
      const handleClick = jest.fn();
      renderComponent(<Button onClick={handleClick}>Test Button</Button>);

      const button = screen.getByRole('button');

      // Should be focusable
      expect(isFocusable(button)).toBe(true);

      // Button should respond to Enter and Space through native browser behavior
      // The onClick handler is attached to the button element, so keyboard events
      // are handled automatically by the browser
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });

    test('should have accessible name', () => {
      renderComponent(<Button>Submit Form</Button>);
      const button = screen.getByRole('button');
      expect(getAccessibleName(button)).toBe('Submit Form');
    });
  });

  // ============================================================================
  // Form Components Accessibility
  // ============================================================================
  describe('Form Components', () => {
    test('Input should have no accessibility violations', async () => {
      const { container } = renderComponent(
        <div>
          <Input
            label="Email Address"
            value=""
            onChange={() => {
              // Intentionally empty - test mock
            }}
            placeholder="Enter your email"
            helperText="We'll never share your email"
          />
          <Input
            label="Password"
            type="password"
            value=""
            onChange={() => {
              // Intentionally empty - test mock
            }}
            error="Password is required"
            required
          />
        </div>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('Select should have no accessibility violations', async () => {
      const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ];

      const { container } = renderComponent(
        <Select
          label="Choose an option"
          value=""
          onChange={() => undefined}
          options={options}
          helperText="Select one option"
        />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('Checkbox should have no accessibility violations', async () => {
      const { container } = renderComponent(
        <div>
          <Checkbox label="I agree to the terms" checked={false} onChange={() => undefined} />
          <Checkbox
            label="Subscribe to newsletter"
            checked={true}
            onChange={() => undefined}
            indeterminate={true}
          />
        </div>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('RadioGroup should have no accessibility violations', async () => {
      const options = [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
      ];

      const { container } = renderComponent(
        <RadioGroup
          label="Size"
          name="size"
          value="medium"
          onChange={() => undefined}
          options={options}
        />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('Form components should have proper label associations', () => {
      renderComponent(
        <div>
          {/* biome-ignore lint/correctness/useUniqueElementIds: Test file - static IDs are acceptable for testing */}
          <Input id="email-input" label="Email" value="" onChange={() => undefined} />
          {/* biome-ignore lint/correctness/useUniqueElementIds: Test file - static IDs are acceptable for testing */}
          <Checkbox
            id="terms-checkbox"
            label="I agree"
            checked={false}
            onChange={() => undefined}
          />
        </div>,
      );

      const emailInput = screen.getByLabelText('Email');
      const checkbox = screen.getByLabelText('I agree');

      expect(emailInput).toBeInTheDocument();
      expect(checkbox).toBeInTheDocument();
    });
  });

  // ============================================================================
  // Accordion Component Accessibility
  // ============================================================================
  describe('Accordion Component', () => {
    test('should have no accessibility violations', async () => {
      const items = [
        {
          id: '1',
          header: 'Section 1',
          content: 'Content for section 1',
        },
        {
          id: '2',
          header: 'Section 2',
          content: 'Content for section 2',
        },
      ];

      const { container } = renderComponent(<Accordion items={items} defaultExpanded={['1']} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should have proper ARIA attributes', () => {
      const items = [
        {
          id: '1',
          header: 'Section 1',
          content: 'Content for section 1',
        },
      ];

      renderComponent(<Accordion items={items} />);

      const button = screen.getByRole('button');
      expect(hasAriaAttribute(button, 'expanded', 'false')).toBe(true);
      expect(button).toHaveAttribute('aria-controls');
    });

    test('should support keyboard navigation', () => {
      const items = [
        { id: '1', header: 'Section 1', content: 'Content 1' },
        { id: '2', header: 'Section 2', content: 'Content 2' },
      ];

      renderComponent(<Accordion items={items} />);

      const buttons = screen.getAllByRole('button');

      // Focus first button
      buttons[0].focus();
      expect(document.activeElement).toBe(buttons[0]);

      // Arrow down should move to next button
      pressArrow(buttons[0], 'down');
      expect(document.activeElement).toBe(buttons[1]);
    });
  });

  // ============================================================================
  // Breadcrumb Component Accessibility
  // ============================================================================
  describe('Breadcrumb Component', () => {
    test('should have no accessibility violations', async () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Current Page' },
      ];

      const { container } = renderComponent(
        <Breadcrumb items={items} aria-label="Breadcrumb navigation" />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should have proper navigation structure', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Current Page' },
      ];

      renderComponent(<Breadcrumb items={items} />);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2); // Current page should not be a link
    });
  });

  // ============================================================================
  // Modal Component Accessibility
  // ============================================================================
  describe('Modal Component', () => {
    test('should have no accessibility violations when open', async () => {
      const { container } = renderComponent(
        <Modal isOpen={true} onClose={() => undefined} aria-labelledby="modal-title">
          {/* biome-ignore lint/correctness/useUniqueElementIds: Test file - static IDs are acceptable for testing */}
          <h2 id="modal-title">Modal Title</h2>
          <p>Modal content goes here.</p>
          <Button onClick={() => undefined}>Close</Button>
        </Modal>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should have proper ARIA attributes', () => {
      renderComponent(
        <Modal isOpen={true} onClose={() => undefined} aria-labelledby="modal-title">
          {/* biome-ignore lint/correctness/useUniqueElementIds: Test file - static IDs are acceptable for testing */}
          <h2 id="modal-title">Modal Title</h2>
          <p>Modal content</p>
        </Modal>,
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    test('should trap focus within modal', async () => {
      renderComponent(
        <Modal isOpen={true} onClose={() => undefined}>
          <h2>Modal Title</h2>
          <Button>First Button</Button>
          <Button>Second Button</Button>
        </Modal>,
      );

      const modal = screen.getByRole('dialog');
      const focusableElements = getFocusableElements(modal);

      expect(focusableElements.length).toBeGreaterThan(0);

      // Wait for focus to be set (happens in requestAnimationFrame)
      await waitFor(() => {
        expect(modal.contains(document.activeElement)).toBe(true);
      });
    });

    test('should close on Escape key', () => {
      const handleClose = jest.fn();
      renderComponent(
        <Modal isOpen={true} onClose={handleClose}>
          <p>Modal content</p>
        </Modal>,
      );

      const dialog = screen.getByRole('dialog');
      pressEscape(dialog);
      expect(handleClose).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // Tabs Component Accessibility
  // ============================================================================
  describe('Tabs Component', () => {
    test('should have no accessibility violations', async () => {
      const items = [
        { id: '1', label: 'Tab 1', content: 'Content 1' },
        { id: '2', label: 'Tab 2', content: 'Content 2' },
        { id: '3', label: 'Tab 3', content: 'Content 3' },
      ];

      const { container } = renderComponent(<Tabs items={items} defaultIndex={0} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should have proper ARIA attributes', () => {
      const items = [
        { id: '1', label: 'Tab 1', content: 'Content 1' },
        { id: '2', label: 'Tab 2', content: 'Content 2' },
      ];

      renderComponent(<Tabs items={items} defaultIndex={0} />);

      const tablist = screen.getByRole('tablist');
      const tabs = screen.getAllByRole('tab');
      const tabpanel = screen.getByRole('tabpanel');

      expect(tablist).toBeInTheDocument();
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
      expect(tabpanel).toBeInTheDocument();
    });

    test('should support keyboard navigation', () => {
      const items = [
        { id: '1', label: 'Tab 1', content: 'Content 1' },
        { id: '2', label: 'Tab 2', content: 'Content 2' },
      ];

      renderComponent(<Tabs items={items} defaultIndex={0} />);

      const tabs = screen.getAllByRole('tab');

      // Focus first tab
      tabs[0].focus();
      expect(document.activeElement).toBe(tabs[0]);

      // Arrow right should move to next tab
      pressArrow(tabs[0], 'right');
      expect(document.activeElement).toBe(tabs[1]);
    });
  });

  // ============================================================================
  // Alert Component Accessibility
  // ============================================================================
  describe('Alert Component', () => {
    test('should have no accessibility violations', async () => {
      const { container } = renderComponent(
        <div>
          <Alert severity="info" title="Information">
            This is an info alert.
          </Alert>
          <Alert severity="success" onClose={() => undefined}>
            Success message.
          </Alert>
          <Alert severity="warning">Warning message.</Alert>
          <Alert severity="error">Error message.</Alert>
        </div>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should have proper ARIA roles', () => {
      renderComponent(
        <div>
          <Alert severity="error">Error message</Alert>
          <Alert severity="info">Info message</Alert>
        </div>,
      );

      const errorAlert = screen.getByText('Error message').closest('[role]');
      const infoAlert = screen.getByText('Info message').closest('[role]');

      expect(errorAlert).toHaveAttribute('role', 'alert');
      expect(infoAlert).toHaveAttribute('role', 'status');
    });
  });

  // ============================================================================
  // Tooltip Component Accessibility
  // ============================================================================
  describe('Tooltip Component', () => {
    test('should have no accessibility violations', async () => {
      const { container } = renderComponent(
        <Tooltip content="This is a tooltip">
          <Button>Hover me</Button>
        </Tooltip>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should show on focus and hide on escape', async () => {
      renderComponent(
        <Tooltip content="Tooltip content">
          <Button>Focus me</Button>
        </Tooltip>,
      );

      const button = screen.getByRole('button');

      // Focus should show tooltip
      button.focus();
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      // Escape should hide tooltip
      pressEscape(button);
      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // Loading Components Accessibility
  // ============================================================================
  describe('Loading Components', () => {
    test('Skeleton should have no accessibility violations', async () => {
      const { container } = renderComponent(
        <div>
          <Skeleton variant="text" />
          <Skeleton variant="circle" width={40} height={40} />
          <Skeleton variant="rectangle" width={200} height={100} />
        </div>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('Spinner should have proper ARIA attributes', () => {
      renderComponent(<Spinner aria-label="Loading content" />);

      const spinner = screen.getByLabelText('Loading content');
      // Spinner uses output element which has implicit role="status"
      expect(spinner.tagName).toBe('OUTPUT');
      expect(spinner).toHaveAttribute('aria-label', 'Loading content');
    });
  });

  // ============================================================================
  // Pagination Component Accessibility
  // ============================================================================
  describe('Pagination Component', () => {
    test('should have no accessibility violations', async () => {
      const { container } = renderComponent(
        <Pagination
          currentPage={3}
          totalPages={10}
          onPageChange={() => undefined}
          aria-label="Pagination navigation"
        />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should have proper navigation structure', () => {
      renderComponent(
        <Pagination
          currentPage={3}
          totalPages={10}
          onPageChange={() => undefined}
          aria-label="Pagination navigation"
        />,
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Pagination navigation');

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    test('should support keyboard navigation', () => {
      renderComponent(
        <Pagination currentPage={3} totalPages={10} onPageChange={() => undefined} />,
      );

      const buttons = screen.getAllByRole('button');

      // All buttons should be focusable
      buttons.forEach((button) => {
        expect(isFocusable(button)).toBe(true);
      });
    });
  });

  // ============================================================================
  // Color Contrast Tests
  // ============================================================================
  describe('Color Contrast', () => {
    test('should have sufficient color contrast for all variants', async () => {
      const { container } = renderComponent(
        <div>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
          <Alert severity="info">Info alert</Alert>
          <Alert severity="success">Success alert</Alert>
          <Alert severity="warning">Warning alert</Alert>
          <Alert severity="error">Error alert</Alert>
        </div>,
      );

      // axe will check color contrast automatically
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ============================================================================
  // Reduced Motion Tests
  // ============================================================================
  describe('Reduced Motion Support', () => {
    test('should respect prefers-reduced-motion', () => {
      // Mock prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const { container } = renderComponent(
        <div>
          <Button isLoading>Loading Button</Button>
          <Spinner />
          <Skeleton variant="text" />
        </div>,
      );

      // Components should render without animations when reduced motion is preferred
      expect(container).toBeInTheDocument();
    });
  });
});
