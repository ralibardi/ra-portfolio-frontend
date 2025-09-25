import React, { Fragment } from 'react';

export const ComponentArray = <T,>({
  render,
  of,
}: {
  render: (item: T, index: number) => React.JSX.Element;
  of: T[];
}) => (
  <Fragment>
    {of.map((item, index) => (
      <Fragment key={index}>{render(item, index)}</Fragment>
    ))}
  </Fragment>
);
