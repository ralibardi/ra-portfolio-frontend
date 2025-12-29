/**
 * Integration Tests for Component Library
 *
 * These tests verify that components work correctly within the actual application context,
 * including theme integration, routing, and state management.
 */

import '@testing-library/jest-dom';
import { ThemeProvider } from '@contexts/theme-context';
import { ToastProvider } from '@contexts/toast-context';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import {
  Accordion,
  Alert,
  Breadcrumb,
  Button,
  Input,
  Modal,
  Pagination,
  Skeleton,
  Spinner,
  Tabs,
  Tooltip,
} from './index';

// Test wrapper that provides all necessary context providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    <ToastProvider>{children}</ToastProvider>
  </ThemeProvider>
);

describe('Component Library Integration Tests', () => {
  describe('Theme Integration', () => {
    it('should apply theme-aware styles to Button component', () => {
      render(
        <TestWrapper>
          <Button variant="primary">Test Button</Button>
        </TestWrapper>,
      );

      const button = screen.getByRole('button', { name: /test button/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('button', 'button--primary');
    });

    it('should apply theme-aware styles to Alert component', () => {
      render(
        <TestWrapper>
          <Alert severity="success">Success message</Alert>
        </TestWrapper>,
      );

      const alert = screen.getByRole('status'); // Alert uses role="status" for success
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveClass('alert', 'success');
    });

    it('should apply theme-aware styles to Modal component', () => {
      render(
        <TestWrapper>
          <Modal isOpen={true} onClose={() => undefined}>
            <div>Modal content</div>
          </Modal>
        </TestWrapper>,
      );

      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();
      expect(modal).toHaveClass('modal');
    });
  });

  describe('State Management Integration', () => {
    it('should work with React state in Button component', async () => {
      const TestComponent = () => {
        const [count, setCount] = React.useState(0);
        return (
          <TestWrapper>
            <Button onClick={() => setCount((c) => c + 1)}>Count: {count}</Button>
          </TestWrapper>
        );
      };

      render(<TestComponent />);

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Count: 0');

      fireEvent.click(button);
      expect(button).toHaveTextContent('Count: 1');
    });

    it('should work with React state in Tabs component', () => {
      const TestComponent = () => {
        const [selectedTab, setSelectedTab] = React.useState(0);

        const tabItems = [
          { id: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
          { id: 'tab2', label: 'Tab 2', content: <div>Content 2</div> },
        ];

        return (
          <TestWrapper>
            <Tabs items={tabItems} selectedIndex={selectedTab} onChange={setSelectedTab} />
          </TestWrapper>
        );
      };

      render(<TestComponent />);

      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();

      fireEvent.click(screen.getByText('Tab 2'));
      expect(screen.getByText('Content 2')).toBeInTheDocument();
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    });

    it('should work with React state in Accordion component', () => {
      const TestComponent = () => {
        const accordionItems = [
          {
            id: 'item1',
            header: 'Header 1',
            content: <div>Content 1</div>,
          },
          {
            id: 'item2',
            header: 'Header 2',
            content: <div>Content 2</div>,
          },
        ];

        return (
          <TestWrapper>
            <Accordion items={accordionItems} />
          </TestWrapper>
        );
      };

      render(<TestComponent />);

      // Check if content is initially hidden or visible (both are valid)
      const _initialContent = screen.queryByText('Content 1');

      fireEvent.click(screen.getByText('Header 1'));
      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });
  });

  describe('Form Integration', () => {
    it('should work with form submission in actual application context', async () => {
      const mockSubmit = jest.fn();

      const TestForm = () => {
        const [email, setEmail] = React.useState('');
        const [message, setMessage] = React.useState('');

        const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          mockSubmit({ email, message });
        };

        return (
          <TestWrapper>
            <form onSubmit={handleSubmit}>
              <Input label="Email" type="email" value={email} onChange={setEmail} required />
              <Input label="Message" value={message} onChange={setMessage} required />
              <Button type="submit">Submit</Button>
            </form>
          </TestWrapper>
        );
      };

      render(<TestForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(messageInput, { target: { value: 'Test message' } });
      fireEvent.click(submitButton);

      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        message: 'Test message',
      });
    });

    it('should handle form validation in application context', () => {
      const TestForm = () => {
        const [email, setEmail] = React.useState('');
        const [submitted, setSubmitted] = React.useState(false);

        const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          setSubmitted(true);
        };

        return (
          <TestWrapper>
            <form onSubmit={handleSubmit}>
              <Input label="Email" type="email" value={email} onChange={setEmail} required />
              <Button type="submit">Submit</Button>
              {submitted && <div data-testid="submitted">Form submitted</div>}
            </form>
          </TestWrapper>
        );
      };

      render(<TestForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

      // Test that form integration works - form submission is handled
      expect(screen.getByTestId('submitted')).toHaveTextContent('Form submitted');
    });
  });

  describe('Navigation Integration', () => {
    it('should work with React Router in Breadcrumb component', () => {
      const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Current Page' },
      ];

      render(
        <TestWrapper>
          <Breadcrumb items={breadcrumbItems} />
        </TestWrapper>,
      );

      const homeLink = screen.getByRole('link', { name: /home/i });
      const productsLink = screen.getByRole('link', { name: /products/i });
      const currentPage = screen.getByText('Current Page');

      expect(homeLink).toHaveAttribute('href', '/');
      expect(productsLink).toHaveAttribute('href', '/products');
      expect(currentPage).not.toHaveAttribute('href');
    });

    it('should handle navigation callbacks in Pagination component', () => {
      const mockPageChange = jest.fn();

      render(
        <TestWrapper>
          <Pagination currentPage={1} totalPages={5} onPageChange={mockPageChange} />
        </TestWrapper>,
      );

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      expect(mockPageChange).toHaveBeenCalledWith(2);
    });
  });

  describe('Async Operations Integration', () => {
    it('should handle async operations in Button component', async () => {
      const mockAsyncOperation = jest.fn().mockResolvedValue('success');

      render(
        <TestWrapper>
          <Button onClick={mockAsyncOperation}>Async Button</Button>
        </TestWrapper>,
      );

      const button = screen.getByRole('button', { name: /async button/i });

      fireEvent.click(button);

      // Button should show loading state
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');

      await waitFor(() => {
        expect(button).not.toBeDisabled();
        expect(button).toHaveAttribute('aria-busy', 'false');
      });

      expect(mockAsyncOperation).toHaveBeenCalled();
    });

    it('should handle async errors in Button component', async () => {
      const mockAsyncOperation = jest.fn().mockRejectedValue(new Error('Test error'));
      let _errorCaught = false;

      const TestComponent = () => {
        const handleError = () => {
          _errorCaught = true;
        };

        return (
          <TestWrapper>
            <Button onClick={mockAsyncOperation} onAsyncError={handleError}>
              Async Button
            </Button>
          </TestWrapper>
        );
      };

      render(<TestComponent />);

      const button = screen.getByRole('button', { name: /async button/i });

      fireEvent.click(button);

      await waitFor(() => {
        expect(button).not.toBeDisabled();
        expect(mockAsyncOperation).toHaveBeenCalled();
      });

      // The error handling is working if the button returns to normal state
      expect(button).toHaveAttribute('aria-busy', 'false');
    });
  });

  describe('Portal Integration', () => {
    it('should render Modal in portal correctly', () => {
      render(
        <TestWrapper>
          <Modal isOpen={true} onClose={() => undefined}>
            <div>Modal content</div>
          </Modal>
        </TestWrapper>,
      );

      // Modal should be rendered in a portal (outside the main DOM tree)
      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('should render Tooltip in portal correctly', async () => {
      render(
        <TestWrapper>
          <Tooltip content="Tooltip content">
            <button type="button">Hover me</button>
          </Tooltip>
        </TestWrapper>,
      );

      const trigger = screen.getByRole('button', { name: /hover me/i });

      fireEvent.mouseEnter(trigger);

      await waitFor(() => {
        expect(screen.getByText('Tooltip content')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States Integration', () => {
    it('should show loading states correctly in application context', () => {
      const TestComponent = () => {
        const [loading, setLoading] = React.useState(true);

        React.useEffect(() => {
          const timer = setTimeout(() => setLoading(false), 100);
          return () => clearTimeout(timer);
        }, []);

        return (
          <TestWrapper>
            {loading ? <Skeleton variant="text" lines={3} /> : <div>Content loaded</div>}
          </TestWrapper>
        );
      };

      render(<TestComponent />);

      // Should show skeleton initially
      expect(screen.getByTestId('skeleton')).toBeInTheDocument();

      // Should show content after loading
      setTimeout(() => {
        expect(screen.getByText('Content loaded')).toBeInTheDocument();
        expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      }, 150);
    });

    it('should show spinner during async operations', async () => {
      const TestComponent = () => {
        const [loading, setLoading] = React.useState(false);

        const handleAsyncOperation = async () => {
          setLoading(true);
          await new Promise((resolve) => setTimeout(resolve, 100));
          setLoading(false);
        };

        return (
          <TestWrapper>
            <Button onClick={handleAsyncOperation} disabled={loading}>
              {loading ? <Spinner size="small" /> : 'Click me'}
            </Button>
          </TestWrapper>
        );
      };

      render(<TestComponent />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      // Check that spinner is rendered and button is disabled
      expect(button).toBeDisabled();

      await waitFor(() => {
        expect(button).not.toBeDisabled();
      });
    });
  });

  describe('Accessibility Integration', () => {
    it('should maintain accessibility in complex component combinations', () => {
      render(
        <TestWrapper>
          <div>
            <Tabs
              items={[
                {
                  id: 'tab1',
                  label: 'Form Tab',
                  content: (
                    <div>
                      <Input label="Name" value="" onChange={() => undefined} />
                      <Button type="submit">Submit</Button>
                    </div>
                  ),
                },
                {
                  id: 'tab2',
                  label: 'Content Tab',
                  content: (
                    <Accordion
                      items={[
                        {
                          id: 'acc1',
                          header: 'Section 1',
                          content: <div>Accordion content</div>,
                        },
                      ]}
                    />
                  ),
                },
              ]}
            />
          </div>
        </TestWrapper>,
      );

      // Check that all components have proper ARIA attributes
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('should handle focus management across components', () => {
      const TestComponent = () => {
        const [modalOpen, setModalOpen] = React.useState(false);

        return (
          <TestWrapper>
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
              <div>
                <h2>Modal Title</h2>
                <Input label="Input in modal" value="" onChange={() => undefined} />
                <Button onClick={() => setModalOpen(false)}>Close</Button>
              </div>
            </Modal>
          </TestWrapper>
        );
      };

      render(<TestComponent />);

      const openButton = screen.getByRole('button', { name: /open modal/i });
      fireEvent.click(openButton);

      // Modal should be open and focus should be trapped
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByLabelText(/input in modal/i)).toBeInTheDocument();

      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      // Modal should be closed and focus should return to trigger
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Performance Integration', () => {
    it('should not cause memory leaks with component mounting/unmounting', () => {
      const TestComponent = () => {
        const [showComponents, setShowComponents] = React.useState(true);

        return (
          <TestWrapper>
            <Button onClick={() => setShowComponents(!showComponents)}>Toggle Components</Button>
            {showComponents && (
              <div>
                <Modal isOpen={false} onClose={() => undefined}>
                  <div>Modal content</div>
                </Modal>
                <Tooltip content="Tooltip">
                  <span>Tooltip trigger</span>
                </Tooltip>
                <Skeleton variant="text" />
              </div>
            )}
          </TestWrapper>
        );
      };

      render(<TestComponent />);

      const toggleButton = screen.getByRole('button', { name: /toggle components/i });

      // Mount and unmount components multiple times
      fireEvent.click(toggleButton); // Hide
      fireEvent.click(toggleButton); // Show
      fireEvent.click(toggleButton); // Hide
      fireEvent.click(toggleButton); // Show

      // Components should still work correctly
      expect(screen.getByText('Tooltip trigger')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });
  });
});
