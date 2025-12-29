import { getDictionary } from '@app/i18n/get-dictionary';
import { PAGES } from '@app/i18n/keys';
import { resolveRequestLocale } from '@app/i18n/locale.server';
import { translate } from '@app/i18n/translate';
import ErrorPage from '@pages/error-page/components/error-page';

const ErrorRoute = async () => {
  const locale = resolveRequestLocale();
  const dictionary = await getDictionary(locale);

  return (
    <ErrorPage
      title={translate(dictionary, PAGES.ERROR.TITLE)}
      message={translate(dictionary, PAGES.ERROR.MESSAGE)}
      actionLabel={translate(dictionary, PAGES.ERROR.GO_BACK)}
    />
  );
};

export default ErrorRoute;
