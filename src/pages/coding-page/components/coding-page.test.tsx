import { act, customRender, screen } from '@utils/test-utilities';
import TestingPage from './coding-page';

describe('CodingPage', () => {
  it('renders without crashing', async () => {
    customRender(<TestingPage />);

    const { element } = await act(() => {
      const element = screen;
      return { element };
    });

    expect(element).not.toBeNull();
  });
});
