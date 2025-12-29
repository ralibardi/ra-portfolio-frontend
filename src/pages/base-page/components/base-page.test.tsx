import type { AppDictionary } from '@app/i18n/get-dictionary';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import enDictionary from '@public/locales/en-GB/translation.json';
import type IRoute from '@type/route';
import { act, customRender, screen } from '@utils/test-utilities';
import BasePage from './base-page';

jest.mock('@components/header', () => () => <div data-testid="header">Mock Header</div>);
jest.mock('@components/footer', () => () => <div data-testid="footer">Mock Footer</div>);

const dictionary = enDictionary as AppDictionary;
const routes: IRoute[] = [
  {
    path: '/',
    labelKey: 'pages.home.name',
    icon: faHome,
    enabled: true,
  },
];

const renderComponent = () =>
  customRender(
    <BasePage dictionary={dictionary} routes={routes}>
      <div data-testid="child">Child content</div>
    </BasePage>,
  );

describe('BasePage', () => {
  it('renders without crashing', async () => {
    renderComponent();

    const { element } = await act(() => {
      const element = screen;
      return { element };
    });

    expect(element).not.toBeNull();
  });

  it('renders the header component', async () => {
    renderComponent();

    const { element } = await act(() => {
      const element = screen.getByTestId('header');
      return { element };
    });

    expect(element).toBeInTheDocument();
  });

  it('renders the footer component', async () => {
    renderComponent();

    const { element } = await act(() => {
      const element = screen.getByTestId('footer');
      return { element };
    });

    expect(element).toBeInTheDocument();
  });

  it('renders provided children', () => {
    renderComponent();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
