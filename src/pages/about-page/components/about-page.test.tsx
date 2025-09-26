import { act, customRender, screen } from '@utils/test-utilities';
import TestingPage from './about-page';

describe('AboutPage', () => {
  it('renders without crashing', async () => {
    customRender(<TestingPage />);

    const { element } = await act(() => {
      const element = screen;
      return { element };
    });

    expect(element).not.toBeNull();
  });
});
