import React from 'react';
import CompanyInfo from './company-info';
import { customRender, screen } from '@utils/test-utilities';

describe('CompanyInfo', () => {
  const renderCompanyInfo = (props = {}) =>
    customRender(<CompanyInfo {...props} />);

  test('should render logo', () => {
    renderCompanyInfo();
    expect(screen.getByTestId('company-info-logo')).toBeInTheDocument();
  });

  test('should render label by default', () => {
    renderCompanyInfo();
    expect(screen.getByTestId('company-info-label')).toBeInTheDocument();
  });

  test('should not render label when isLabelHidden is true', () => {
    renderCompanyInfo({ isLabelHidden: true });
    expect(screen.queryByTestId('company-info-label')).not.toBeInTheDocument();
  });

  test('should render link to home page', () => {
    renderCompanyInfo();
    expect(screen.getByTestId('company-info-link')).toHaveAttribute(
      'href',
      '/',
    );
  });
});
