import { render, screen } from '@testing-library/react';
import HealthPage from './health-page';

describe('HealthPage', () => {
  it('renders without crashing', async () => {
    render(<HealthPage />);
    const container = await screen.findByRole('generic');
    expect(container).toBeInTheDocument();
  });
});
