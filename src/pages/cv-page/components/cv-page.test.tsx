import { render, screen } from '@testing-library/react';
import CVPage from './cv-page';

describe('CVPage', () => {
  it('renders without crashing', async () => {
    render(<CVPage />);
    const container = await screen.findByRole('generic');
    expect(container).toBeInTheDocument();
  });
});
