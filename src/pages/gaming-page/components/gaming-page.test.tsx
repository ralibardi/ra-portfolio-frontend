import { render, screen } from '@testing-library/react';
import GamingPage from './gaming-page';

describe('GamingPage', () => {
  it('renders without crashing', async () => {
    render(<GamingPage />);
    expect(await screen.findByRole('heading', { name: /gaming/i })).toBeInTheDocument();
  });
});
