import type { Metadata } from 'next';
import './globals.css';
import '@assets/index.scss';

import { getDictionary } from '@app/i18n/get-dictionary';
import { resolveRequestLocale } from '@app/i18n/locale.server';
import BasePage from '@pages/base-page';
import { getAppRoutes } from '@utils/get-app-routes';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Ronny Alibardi | Portfolio',
  description: 'Personal portfolio showcasing ongoing work and experiments.',
};

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

const RootLayout = async ({ children }: RootLayoutProps) => {
  const locale = resolveRequestLocale();
  const dictionary = await getDictionary(locale);
  const routes = getAppRoutes().filter((route) => route.enabled);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <Providers dictionary={dictionary}>
          <BasePage dictionary={dictionary} routes={routes}>
            {children}
          </BasePage>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
