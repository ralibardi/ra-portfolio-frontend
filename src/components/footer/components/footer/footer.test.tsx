import type { AppDictionary } from '@app/i18n/get-dictionary';
import enDictionary from '@public/locales/en-GB/translation.json';
import { customRender, screen } from '@utils/test-utilities';
import Footer from './footer';

jest.mock('../footer-socials/footer-socials', () => () => (
  <div data-testid="footer-socials">Socials</div>
));

const dictionary = enDictionary as AppDictionary;

describe('Footer', () => {
  test('renders without crashing and displays the correct copyright text', async () => {
    customRender(<Footer dictionary={dictionary} />);

    const copyrightElement = await screen.findByTestId('footer-copyright');

    expect(copyrightElement).toBeInTheDocument();
    expect(copyrightElement).toHaveTextContent(dictionary.footer.copyright);
  });
});
