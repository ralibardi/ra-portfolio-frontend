import { render, screen } from '@testing-library/react';
import CVPage from './cv-page';

describe('CVPage', () => {
  it('renders without crashing', async () => {
    render(<CVPage />);
    expect(await screen.findByRole('heading', { name: /curriculum vitae/i })).toBeInTheDocument();
  });
});
