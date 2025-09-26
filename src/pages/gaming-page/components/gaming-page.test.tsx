import { render, screen } from '@testing-library/react';
import GamingPage from './gaming-page';

describe('GamingPage', () => {
  it('renders without crashing', async () => {
    render(<GamingPage />);
    const container = await screen.findByRole('generic');
    expect(container).toBeInTheDocument();
  });
});
