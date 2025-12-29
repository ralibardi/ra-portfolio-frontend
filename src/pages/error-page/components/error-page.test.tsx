import { act, customRender, screen } from '@utils/test-utilities';
import ErrorPage from './error-page';

describe('ErrorPage', () => {
  const defaultProps = {
    title: 'Oops... Something went wrong',
    message: 'We apologize for the inconvenience. Please try again later.',
    actionLabel: 'Go home',
  };

  it('renders the error heading', async () => {
    customRender(<ErrorPage {...defaultProps} />);

    const { headingElement } = await act(() => {
      const headingElement = screen.getByTestId('error-heading');
      return { headingElement };
    });

    expect(headingElement).toBeInTheDocument();
  });

  it('renders the message text', async () => {
    customRender(<ErrorPage {...defaultProps} />);

    const message = await screen.findByText(defaultProps.message);
    expect(message).toBeInTheDocument();
  });

  it('shows error details when error is provided', async () => {
    const error = new Error('Test error');
    customRender(<ErrorPage {...defaultProps} error={error} />);

    const { summaryElement } = await act(() => {
      const summaryElement = screen.getByTestId('error-details-message');
      return { summaryElement };
    });

    expect(summaryElement).toHaveTextContent(`${error.name} - ${error.message}`);
  });

  it('does not render error details when no error is provided', () => {
    customRender(<ErrorPage {...defaultProps} />);
    expect(screen.queryByTestId('error-details')).not.toBeInTheDocument();
  });
});
