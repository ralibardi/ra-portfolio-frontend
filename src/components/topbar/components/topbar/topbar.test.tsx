import { faAccessibleIcon } from '@fortawesome/free-brands-svg-icons';
import type IRoute from '@type/route';
import { customRender, screen } from '@utils/test-utilities';
import Topbar from './topbar';

const TestableComponent = () => <div />;

describe('Topbar', () => {
  const mockRoutes: IRoute[] = [
    {
      path: 'test',
      index: true,
      component: TestableComponent,
      labelKey: 'test',
      icon: faAccessibleIcon,
      enabled: true,
      hidden: false,
    },
    {
      path: 'test2',
      index: true,
      component: TestableComponent,
      labelKey: 'test2',
      icon: faAccessibleIcon,
      enabled: true,
      hidden: false,
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
    expect(navLinks).toHaveLength(mockRoutes.filter((r) => r.enabled && !r.hidden).length);
  });
});
