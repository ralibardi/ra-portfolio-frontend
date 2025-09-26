import { render, screen } from '@testing-library/react';
import Loading from './loading';

describe('Loading component', () => {
  const renderLoading = (props = {}) => {
    render(<Loading {...props} />);
    return {
      loadingContainer: screen.getByTestId('loading-container'),
      loadingSpinner: screen.getByTestId('loading-spinner'),
    };
  };

  test.each([
    ['default', {}],
    ['medium', { size: 'medium' }],
    ['large', { size: 'large' }],
  ])('renders with %s size', (_, props) => {
    const { loadingContainer, loadingSpinner } = renderLoading(props);

    expect(loadingContainer).toBeInTheDocument();
    expect(loadingSpinner).toBeInTheDocument();
  });
});
