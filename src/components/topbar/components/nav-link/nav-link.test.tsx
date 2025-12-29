import { faHome } from '@fortawesome/free-solid-svg-icons';
import { customRender, screen } from '@utils/test-utilities';
import type { NavigationLink } from '../../types/topbar-props';
import NavLink from './nav-link';

describe('NavLink', () => {
  const route: NavigationLink = {
    path: '/home',
    label: 'Home',
    icon: faHome,
  };

  const renderNavLink = (isActive: boolean) => {
    customRender(<NavLink route={route} isActive={isActive} />);
    const links = screen.getAllByRole('link');
    return links[links.length - 1];
  };

  it('should render the NavLink component', () => {
    const linkElement = renderNavLink(false);
    expect(linkElement).toBeInTheDocument();
  });

  it('should render the provided label', () => {
    const linkElement = renderNavLink(false);
    expect(linkElement).toHaveTextContent(route.label);
  });

  it('should apply the active class based on isActive prop', () => {
    const activeLinkElement = renderNavLink(true);
    expect(activeLinkElement).toHaveClass('active');

    const inactiveLinkElement = renderNavLink(false);
    expect(inactiveLinkElement).not.toHaveClass('active');
  });
});
