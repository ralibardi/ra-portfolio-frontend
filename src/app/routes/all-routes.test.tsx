import { ThemeProvider } from '@contexts/theme-context';
import { render, screen } from '@testing-library/react';
import { act, type FunctionComponent } from 'react';
import AllRoutes from './all-routes';

jest.mock('@pages/base-page', () => () => <div data-testid="root-route">Mock BasePage</div>);
jest.mock('@components/loading', () => () => <div data-testid="loading">Mock Loading</div>);

const TestableComponent: FunctionComponent = () => {
  return (
    <ThemeProvider>
      <AllRoutes />
    </ThemeProvider>
  );
};

describe('AllRoutes', () => {
  it('renders without crashing', async () => {
    render(<TestableComponent />);

    const element = await act(() => {
      const element = screen;
      return element;
    });

    expect(element).not.toBeNull();
  });

  it('renders the BasePage component', async () => {
    render(<TestableComponent />);

    const element = await act(() => {
      const element = screen.getByTestId('root-route');
      return element;
    });

    expect(element).toBeInTheDocument();
  });
});
