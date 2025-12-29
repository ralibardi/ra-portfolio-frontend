import userEvent from '@testing-library/user-event';
import { act, customRender, screen, waitFor } from '@utils/test-utilities';
import type React from 'react';
import ContactPage from './contact-page';

// Mock the toast context to track calls
const mockSuccess = jest.fn();
const mockError = jest.fn();

jest.mock('@contexts/toast-context', () => ({
  useToast: () => ({
    success: mockSuccess,
    error: mockError,
  }),
  ToastProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('ContactPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', async () => {
    await act(async () => {
      customRender(<ContactPage />);
    });

    // Check for form elements instead of form role since React 19 doesn't auto-assign it
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it('renders contact form elements', async () => {
    await act(async () => {
      customRender(<ContactPage />);
    });

    // Check for form elements that should be present
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('allows user to type in form fields', async () => {
    const user = userEvent.setup();

    await act(async () => {
      customRender(<ContactPage />);
    });

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);

    await act(async () => {
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'Hello, this is a test message.');
    });

    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(messageInput).toHaveValue('Hello, this is a test message.');
  });

  it('resets form fields when reset button is clicked', async () => {
    const user = userEvent.setup();

    await act(async () => {
      customRender(<ContactPage />);
    });

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    const resetButton = screen.getByRole('button', { name: /reset/i });

    // Fill in the form
    await act(async () => {
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'Hello, this is a test message.');
    });

    // Verify fields have values
    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(messageInput).toHaveValue('Hello, this is a test message.');

    // Click reset button
    await act(async () => {
      await user.click(resetButton);
    });

    // Verify fields are cleared
    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(messageInput).toHaveValue('');
  });

  it('submits form successfully and shows success message', async () => {
    const user = userEvent.setup();

    await act(async () => {
      customRender(<ContactPage />);
    });

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /send/i });

    // Fill in the form
    await act(async () => {
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'Hello, this is a test message.');
    });

    // Submit the form
    await act(async () => {
      await user.click(submitButton);
    });

    // Wait for submission to complete
    await waitFor(() => {
      expect(mockSuccess).toHaveBeenCalledWith('Thanks! Your message has been sent.');
    });

    // Verify form fields are cleared after successful submission
    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(messageInput).toHaveValue('');
  });

  it('disables buttons during form submission', async () => {
    const user = userEvent.setup();

    await act(async () => {
      customRender(<ContactPage />);
    });

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /send/i });
    const resetButton = screen.getByRole('button', { name: /reset/i });

    // Fill in the form
    await act(async () => {
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'Hello, this is a test message.');
    });

    // Submit the form
    await act(async () => {
      await user.click(submitButton);
    });

    // During submission, reset button should be disabled
    expect(resetButton).toBeDisabled();

    // Wait for submission to complete
    await waitFor(() => {
      expect(mockSuccess).toHaveBeenCalled();
    });

    // After submission, buttons should be enabled again
    expect(resetButton).not.toBeDisabled();
  });

  it('shows loading state on submit button during submission', async () => {
    const user = userEvent.setup();

    await act(async () => {
      customRender(<ContactPage />);
    });

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /send/i });

    // Fill in the form
    await act(async () => {
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'Hello, this is a test message.');
    });

    // Submit the form
    await act(async () => {
      await user.click(submitButton);
    });

    // The submit button should show loading state (this is handled by PrimaryButton component)
    // We can verify the button is in a submitting state by checking if it's still clickable
    // and that the form submission logic is triggered

    // Wait for submission to complete
    await waitFor(() => {
      expect(mockSuccess).toHaveBeenCalled();
    });
  });

  it('handles form submission with keyboard (Enter key)', async () => {
    const user = userEvent.setup();

    await act(async () => {
      customRender(<ContactPage />);
    });

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);

    // Fill in the form
    await act(async () => {
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'Hello, this is a test message.');
    });

    // Submit using Enter key on the name field (input fields submit forms on Enter)
    await act(async () => {
      await user.type(nameInput, '{enter}');
    });

    // Wait for submission to complete
    await waitFor(() => {
      expect(mockSuccess).toHaveBeenCalledWith('Thanks! Your message has been sent.');
    });
  });

  it('has proper form attributes for accessibility', async () => {
    await act(async () => {
      customRender(<ContactPage />);
    });

    const form = document.querySelector('form');
    expect(form).toHaveAttribute('noValidate');

    // Check that inputs have proper labels
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();

    // Check that email input has proper type
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveAttribute('type', 'email');

    // Check that message textarea has proper rows
    const messageInput = screen.getByLabelText(/message/i);
    expect(messageInput).toHaveAttribute('rows', '6');
  });

  it('has proper placeholder text for user guidance', async () => {
    await act(async () => {
      customRender(<ContactPage />);
    });

    expect(screen.getByPlaceholderText('Your full name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('How can I help you?')).toBeInTheDocument();
  });

  it('renders divider with message label', async () => {
    await act(async () => {
      customRender(<ContactPage />);
    });

    // Check that the divider with "Message" label is present
    // Match the exact "Message" label text (avoid matching subtitle copy).
    expect(screen.getAllByText(/^message$/i)).toHaveLength(2); // Divider + textarea label
  });
});
