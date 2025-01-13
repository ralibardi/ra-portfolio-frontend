import React from 'react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from './theme-toggle';
import { customRender, screen } from '@utils/test-utilities';

describe('ThemeToggle', () => {
  test('displays the toggle component', () => {
    customRender(<ThemeToggle />);
    const toggleLabelElement = screen.getByTestId('toggle-label');
    expect(toggleLabelElement).toBeInTheDocument();
  });

  test('updates the theme prop when toggled', async () => {
    customRender(<ThemeToggle />);
    const toggleInputElement = screen.getByTestId('toggle-input');

    await userEvent.click(toggleInputElement);
    expect(toggleInputElement).toBeChecked();

    await userEvent.click(toggleInputElement);
    expect(toggleInputElement).not.toBeChecked();
  });
});
