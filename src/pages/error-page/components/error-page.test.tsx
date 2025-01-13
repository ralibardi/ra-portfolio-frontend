import React from 'react';
import { act, customRender, screen } from '@utils/test-utilities';
import ErrorPage from './error-page';

describe('ErrorPage', () => {
  it('renders the error message', async () => {
    customRender(<ErrorPage />);

    const { headingElement } = await act(() => {
      const headingElement = screen.getByTestId('error-heading');
      return { headingElement };
    });

    expect(headingElement).toBeInTheDocument();
  });

  it('renders the correct heading', async () => {
    const error = new Error('Test error');
    customRender(<ErrorPage error={error} />);

    const { headingElement } = await act(() => {
      const headingElement = screen.getByTestId('error-heading');
      return { headingElement };
    });

    expect(headingElement).toHaveTextContent('Oops... Something went wrong');
  });

  it('renders the correct paragraph', async () => {
    const error = new Error('Test error');
    customRender(<ErrorPage error={error} />);

    const { paragraphElement } = await act(() => {
      const paragraphElement = screen.getByTestId('error-details-message');
      return { paragraphElement };
    });

    expect(paragraphElement).toBeInTheDocument();
  });
});
