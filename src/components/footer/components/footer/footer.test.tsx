import { FOOTER } from '@app/i18n/keys';
import { customRender, screen } from '@utils/test-utilities';
import Footer from './footer';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('Footer', () => {
  test('renders without crashing and displays the correct copyright text', async () => {
    customRender(<Footer />);

    const copyrightElement = await screen.findByTestId('footer-copyright');

    expect(copyrightElement).toBeInTheDocument();
    expect(copyrightElement).toHaveTextContent(FOOTER.COPYRIGHT);
  });
});
