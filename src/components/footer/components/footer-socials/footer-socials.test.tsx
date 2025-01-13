import React from 'react';
import FooterSocials from './footer-socials';
import { faAccessibleIcon } from '@fortawesome/free-brands-svg-icons';
import { customRender, screen } from '@utils/test-utilities';
import { ISocialLink } from '../../utils/getSocialLinks';

jest.mock('@components/icon-link', () => ({
  __esModule: true,
  default: ({ linkUrl }: { linkUrl: string }) => (
    <a href={linkUrl} data-testid="icon-link" />
  ),
}));

jest.mock('@utils/component-array', () => ({
  ComponentArray: ({ of }: { of: ISocialLink[] }) => (
    <>
      {of.map((item, index) => (
        <a href={item.link} data-testid="icon-link" key={index} />
      ))}
    </>
  ),
}));

describe('FooterSocials', () => {
  it('renders social links correctly', () => {
    const mockSocialLinks: ISocialLink[] = [
      {
        icon: faAccessibleIcon,
        link: 'http://link1.com',
        order: 0,
        isHidden: false,
      },
      {
        icon: faAccessibleIcon,
        link: 'http://link2.com',
        order: 1,
        isHidden: false,
      },
    ];

    customRender(<FooterSocials socialLinks={mockSocialLinks} />);

    const container = screen.getByTestId('test');
    const links = screen.getAllByTestId('icon-link');

    expect(container).toBeInTheDocument();
    expect(links).toHaveLength(mockSocialLinks.length);
    expect(links[0]).toHaveAttribute('href', 'http://link1.com');
    expect(links[1]).toHaveAttribute('href', 'http://link2.com');
  });
});
