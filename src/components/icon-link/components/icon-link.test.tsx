import { library } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { render, screen } from '@testing-library/react';
import IconLink from './icon-link';

// Add the required icon to the library
library.add(faGithub);

describe('IconLink', () => {
  const renderIconLink = (props = {}) => {
    render(<IconLink icon={faGithub} {...props} />);
  };

  test('renders without crashing', () => {
    renderIconLink();
  });

  test('renders the icon', () => {
    renderIconLink();

    const iconElement = screen.getByTestId('icon-link-icon');
    const linkElement = screen.getByTestId('icon-link');

    expect(iconElement).toBeInTheDocument();
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).not.toHaveAttribute('href');
  });

  test('renders the link with the correct URL', () => {
    const linkUrl = 'https://github.com';
    renderIconLink({ linkUrl });

    const linkElement = screen.getByTestId('icon-link');

    expect(linkElement).toHaveAttribute('href', linkUrl);
  });

  test('renders the title', () => {
    const title = 'GitHub';
    renderIconLink({ title });

    const labelElement = screen.getByTestId('icon-link-label');

    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveTextContent(title);
  });

  test('does not render the title when not provided', () => {
    renderIconLink();

    const labelElement = screen.queryByTestId('icon-link-label');

    expect(labelElement).not.toBeInTheDocument();
  });
});
