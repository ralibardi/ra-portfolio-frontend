import type React from 'react';
import { Fragment } from 'react';

export const ComponentArray = <T,>({
  render,
  of,
  keyExtractor,
}: {
  render: (item: T, index: number) => React.JSX.Element;
  of: T[];
  keyExtractor?: (item: T, index: number) => string | number;
}) => (
  <>
    {of.map((item, index) => (
      <Fragment key={keyExtractor ? keyExtractor(item, index) : index}>
        {render(item, index)}
      </Fragment>
    ))}
  </>
);
