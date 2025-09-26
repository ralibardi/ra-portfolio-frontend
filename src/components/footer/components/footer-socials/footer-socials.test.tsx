import { faAccessibleIcon } from '@fortawesome/free-brands-svg-icons';
import { customRender, screen } from '@utils/test-utilities';
import type { ISocialLink } from '../../utils/getSocialLinks';
import FooterSocials from './footer-socials';

jest.mock('@components/icon-link', () => {
  const mockModule = {
    // biome-ignore lint/style/useNamingConvention: Required for Jest ES module mock
    __esModule: true,
    default: ({ linkUrl }: { linkUrl: string }) => (
      <a href={linkUrl} data-testid="icon-link" aria-label="Social link">
        Link
      </a>
    ),
  };
  return mockModule;
});

jest.mock('@utils/component-array', () => ({
  ComponentArray: ({ of }: { of: ISocialLink[] }) => (
    <>
      {of.map((item) => (
        <a href={item.link} data-testid="icon-link" key={item.link} aria-label="Social link">
          Link
        </a>
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
