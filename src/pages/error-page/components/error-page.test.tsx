import React from 'react';
import { act, customRender, screen } from '@utils/test-utilities';
import ErrorPage from './error-page';

describe('ErrorPage', () => {
  it('renders the error message', async () => {
    customRender(<ErrorPage />);

    const { headingElement } = await act(() => {
      const headingElement = screen.getByTestId('error-heading');
      return { headingElement };
    });

    expect(headingElement).toBeInTheDocument();
  });

  it('renders the correct heading', async () => {
    const error = new Error('Test error');
    customRender(<ErrorPage error={error} />);

    const { headingElement } = await act(() => {
      const headingElement = screen.getByTestId('error-heading');
      return { headingElement };
    });

    expect(headingElement).toHaveTextContent('Oops... Something went wrong');
  });

  it('renders the correct paragraph', async () => {
    const error = new Error('Test error');
    customRender(<ErrorPage error={error} />);

    const { paragraphElement } = await act(() => {
      const paragraphElement = screen.getByTestId('error-details-message');
      return { paragraphElement };
    });

    expect(paragraphElement).toBeInTheDocument();
  });

  // Additional tests to increase coverage

  it('does not render error details when no error prop is provided', () => {
    customRender(<ErrorPage />);
    expect(screen.queryByTestId('error-details')).not.toBeInTheDocument();
  });

  it('renders error details with correct content when error prop is provided', async () => {
    const error = new Error('Test error');
    error.name = 'TestError';
    error.stack = 'Test stack trace';
    customRender(<ErrorPage error={error} />);

    const { detailsElement, summaryElement, stackElement } = await act(() => {
      const detailsElement = screen.getByTestId('error-details');
      const summaryElement = screen.getByTestId('error-details-message');
      const stackElement = screen.getByTestId('error-details-stack');
      return { detailsElement, summaryElement, stackElement };
    });

    expect(detailsElement).toBeInTheDocument();
    expect(summaryElement).toHaveTextContent(`${error.name} - ${error.message}`);
    expect(stackElement).toHaveTextContent('Test stack trace');
  });

  it('calls window.history.back when the back button is clicked', async () => {
    const backSpy = jest.spyOn(window.history, 'back').mockImplementation(() => {});
    customRender(<ErrorPage />);
    const { backButton } = await act(() => {
      const backButton = screen.getByRole('button');
      return { backButton };
    });
    act(() => {
      backButton.click();
    });
    expect(backSpy).toHaveBeenCalled();
    backSpy.mockRestore();
  });

  it('matches snapshot when error is provided', () => {
    const error = new Error('Snapshot error');
    error.name = 'SnapshotError';
    error.stack = 'Snapshot stack trace';
    const { container } = customRender(<ErrorPage error={error} />);
    expect(container).toMatchSnapshot();
  });
});
