import { faAccessibleIcon } from '@fortawesome/free-brands-svg-icons';
import { customRender, screen } from '@utils/test-utilities';
import type { NavigationLink } from '../../types/topbar-props';
import Topbar from './topbar';

jest.mock('next/navigation', () => ({
  usePathname: () => '/test',
}));

describe('Topbar', () => {
  const mockRoutes: NavigationLink[] = [
    {
      path: '/test',
      label: 'Test',
      icon: faAccessibleIcon,
    },
    {
      path: '/test-2',
      label: 'Test 2',
      icon: faAccessibleIcon,
    },
  ];

  it('renders without crashing', () => {
    customRender(<Topbar routes={mockRoutes} />);
    const element = screen.getByTestId('topbar-container');
    expect(element).toBeInTheDocument();
  });

  it('renders the correct number of nav links', () => {
    customRender(<Topbar routes={mockRoutes} />);
    const navLinks = screen.getAllByTestId('nav-link-label');
    expect(navLinks).toHaveLength(mockRoutes.length);
  });
});
