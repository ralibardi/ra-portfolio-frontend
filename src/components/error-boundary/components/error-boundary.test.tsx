import { render, screen } from '@testing-library/react';
import { act } from 'react';
import ErrorBoundary from './error-boundary';

describe('ErrorBoundary', () => {
  let consoleErrorSpy: jest.SpyInstance;
  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Suppress console errors in tests
    });
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should render children when there is no error', async () => {
    render(
      <ErrorBoundary>
        <div>Child Component</div>
      </ErrorBoundary>,
    );

    const { childComponent } = await act(() => {
      const childComponent = screen.getByText('Child Component');
      return { childComponent };
    });

    expect(childComponent).toBeInTheDocument();
  });

  it('should render error container when there is an error', async () => {
    const errorMessage = 'Something went wrong';
    const ErrorThrowingComponent = () => {
      throw new Error(errorMessage);
    };

    render(
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>,
    );

    const { errorComponent } = await act(() => {
      const errorComponent = screen.getByTestId('error-page-container');
      return { errorComponent };
    });

    expect(errorComponent).toBeInTheDocument();
  });

  it('should render error header when there is an error', async () => {
    const errorMessage = 'Something went wrong';
    const ErrorThrowingComponent = () => {
      throw new Error(errorMessage);
    };

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Suppress console.error during test
    });

    render(
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>,
    );

    const { errorComponent } = await act(() => {
      const errorComponent = screen.getByTestId('error-header-container');
      return { errorComponent };
    });

    expect(errorComponent).toBeInTheDocument();
    consoleErrorSpy.mockRestore();
  });

  it('should renders back button when there is an error', async () => {
    const errorMessage = 'Something went wrong';
    const ErrorThrowingComponent = () => {
      throw new Error(errorMessage);
    };

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Suppress console.error during test
    });

    render(
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>,
    );

    const { button } = await act(() => {
      const button = screen.getByTestId('button-with-icon-container');
      return { button };
    });

    expect(button).toBeInTheDocument();
    consoleErrorSpy.mockRestore();
  });

  it('should render error message when there is an error', async () => {
    const errorMessage = 'Something went wrong';
    const ErrorThrowingComponent = () => {
      throw new Error(errorMessage);
    };

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Suppress console.error during test
    });

    render(
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>,
    );

    const { label } = await act(() => {
      const label = screen.getByTestId('error-heading');
      return { label };
    });

    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('Oops... Something went wrong');
    consoleErrorSpy.mockRestore();
  });

  it('should render error details when there is an error', async () => {
    const errorMessage = 'Something went wrong';
    const ErrorThrowingComponent = () => {
      throw new Error(errorMessage);
    };

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Suppress console.error during test
    });

    render(
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>,
    );

    const { details, message } = await act(() => {
      const details = screen.getByTestId('error-details');
      const message = screen.getByTestId('error-details-message');

      return { details, message };
    });

    expect(details).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(message).toHaveTextContent(errorMessage);
    consoleErrorSpy.mockRestore();
  });
});
