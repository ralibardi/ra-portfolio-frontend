import { render, screen } from '@testing-library/react';
import PhotographyPage from './photography-page';

describe('PhotographyPage', () => {
  it('renders without crashing', async () => {
    render(<PhotographyPage />);
    expect(await screen.findByRole('heading', { name: /photography/i })).toBeInTheDocument();
  });
});
