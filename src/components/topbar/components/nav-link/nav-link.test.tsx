import { faHome } from '@fortawesome/free-solid-svg-icons';
import type IRoute from '@type/route';
import { customRender, screen } from '@utils/test-utilities';
import NavLink from './nav-link';

describe('NavLink', () => {
  const route: IRoute = {
    path: '/home',
    labelKey: 'Home',
    index: false,
    component: () => null,
    icon: faHome,
  };

  const renderNavLink = (isActive: boolean) => {
    customRender(<NavLink route={route} isActive={isActive} />);
    return screen.getAllByRole('link');
  };

  it('should render the NavLink component', () => {
    const linkElement = renderNavLink(false)[0];
    expect(linkElement).toBeInTheDocument();
  });

  it('should render the correct labelKey', () => {
    const linkElement = renderNavLink(false)[0];
    expect(linkElement).toHaveTextContent('Home');
  });

  it('should have the correct active class based on isActive prop', () => {
    const activeLinkElement = renderNavLink(true)[0];
    expect(activeLinkElement).toHaveClass('active');

    const inactiveLinkElement = renderNavLink(false)[1];
    expect(inactiveLinkElement).not.toHaveClass('active');
  });
});
