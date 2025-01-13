import React from 'react';
import TestingPage from './about-page';
import { act, customRender, screen } from '@utils/test-utilities';

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
