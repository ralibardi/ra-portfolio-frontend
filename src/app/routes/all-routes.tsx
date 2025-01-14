import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { FunctionComponent, Suspense, lazy } from 'react';
import { getAppRoutes } from '@utils/get-app-routes';
import IRoute from '@type/route';
import { rootPath } from '@utils/route-paths';

const Loading = lazy(() => import('@components/loading'));
const BasePage = lazy(() => import('@pages/base-page'));

const AllRoutes: FunctionComponent = () => {
  const enabledRoutes = React.useMemo(
    () => getAppRoutes.filter((r) => r.enabled),
    [],
  );

  return (
    <Suspense fallback={<Loading />}>
      <BrowserRouter>
        <Routes>
          <Route path={rootPath} element={<BasePage />}>
            {enabledRoutes.map((route: IRoute) => (
              <Route
                key={route.path}
                path={route.path}
                index={route.index}
                element={<route.component />}
              />
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

export default React.memo(AllRoutes);
