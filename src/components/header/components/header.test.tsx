import type { AppDictionary } from '@app/i18n/get-dictionary';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import enDictionary from '@public/locales/en-GB/translation.json';
import type IRoute from '@type/route';
import { act, customRender, screen } from '@utils/test-utilities';
import Header from './header';

// Mock components
jest.mock('@components/company-info', () => () => (
  <div data-testid="company-info">Mock CompanyInfo</div>
));
jest.mock('@components/topbar', () => () => <div data-testid="topbar">Mock Topbar</div>);
jest.mock('@components/theme-toggle', () => () => (
  <div data-testid="theme-toggle">Mock ThemeToggle</div>
));

const dictionary = enDictionary as AppDictionary;
const routes: IRoute[] = [{ path: '/', labelKey: 'pages.home.name', icon: faHome, enabled: true }];

const renderHeader = () => customRender(<Header dictionary={dictionary} routes={routes} />);

describe('Header', () => {
  test('renders without crashing', async () => {
    await act(() => renderHeader());
  });

  test('renders the Topbar component', async () => {
    renderHeader();

    const { topbarElement } = await act(() => {
      const topbarElement = screen.getByTestId('topbar');
      return { topbarElement };
    });

    expect(topbarElement).not.toBeNull();
  });

  test('renders the CompanyInfo component', async () => {
    renderHeader();

    const { companyInfoElement } = await act(() => {
      const companyInfoElement = screen.getByTestId('company-info');
      return { companyInfoElement };
    });

    expect(companyInfoElement).not.toBeNull();
  });

  test('renders the ThemeToggle component', async () => {
    renderHeader();

    const { themeToggleElement } = await act(() => {
      const themeToggleElement = screen.getByTestId('theme-toggle');
      return { themeToggleElement };
    });

    expect(themeToggleElement).not.toBeNull();
  });
});
