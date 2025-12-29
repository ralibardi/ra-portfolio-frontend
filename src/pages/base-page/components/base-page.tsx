import type { AppDictionary } from '@app/i18n/get-dictionary';
import Footer from '@components/footer';
import Header from '@components/header';
import type IRoute from '@type/route';
import type { FunctionComponent, ReactNode } from 'react';
import styles from '../assets/base-page.module.scss';

interface BasePageProps {
  readonly children: ReactNode;
  readonly dictionary: AppDictionary;
  readonly routes: readonly IRoute[];
}

const BasePage: FunctionComponent<BasePageProps> = ({ children, dictionary, routes }) => {
  return (
    <main className={styles.container}>
      <Header routes={routes} dictionary={dictionary} />
      <div className={styles.content}>{children}</div>
      <Footer dictionary={dictionary} />
    </main>
  );
};

export default BasePage;
