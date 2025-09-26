import { COMPANY_NAME } from '@app/i18n/keys';
import { customRender, screen } from '@utils/test-utilities';
import CompanyInfo from './company-info';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock the logo import to prevent empty src attribute
jest.mock('../assets/logo.jpg', () => 'test-logo.jpg');

describe('CompanyInfo', () => {
  const renderCompanyInfo = (props = {}) => customRender(<CompanyInfo {...props} />);

  test('renders company info component', () => {
    renderCompanyInfo();
    expect(screen.getByTestId('company-info')).toBeInTheDocument();
  });

  test('renders logo with correct attributes', () => {
    renderCompanyInfo();
    const logo = screen.getByTestId('company-info-logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('alt', 'Logo');
    expect(logo).toHaveClass('imageSmall');
  });

  test('renders company name label by default', () => {
    renderCompanyInfo();
    const label = screen.getByTestId('company-info-label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent(COMPANY_NAME);
  });

  test('hides label when isLabelHidden is true', () => {
    renderCompanyInfo({ isLabelHidden: true });
    expect(screen.queryByTestId('company-info-label')).not.toBeInTheDocument();
  });

  test('renders link with correct attributes', () => {
    renderCompanyInfo();
    const link = screen.getByTestId('company-info-link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
    expect(link).toHaveClass('wrapper');
  });

  test('renders all elements in correct container', () => {
    renderCompanyInfo();
    const container = screen.getByTestId('company-info');
    expect(container).toHaveClass('container');
    expect(container).toContainElement(screen.getByTestId('company-info-link'));
  });
});
