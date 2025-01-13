import React, { Children, Fragment } from 'react';

export const ComponentArray = <T,>({
  render,
  of,
}: {
  render: (item: T, index: number) => React.JSX.Element;
  of: T[];
}) => (
  <Fragment>
    {Children.toArray(of.map((item, index) => render(item, index)))}
  </Fragment>
);
