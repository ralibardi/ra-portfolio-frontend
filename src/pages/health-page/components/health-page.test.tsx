import { render, screen } from '@testing-library/react';
import HealthPage from './health-page';

describe('HealthPage', () => {
  it('renders without crashing', async () => {
    render(<HealthPage />);
    // Prefer a stable, user-visible assertion over a generic container role.
    expect(await screen.findByRole('heading', { name: /health/i })).toBeInTheDocument();
  });
});
