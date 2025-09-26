import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import type { FunctionComponent } from 'react';

interface IRoute {
  readonly path: string;
  readonly index: boolean;
  readonly component: FunctionComponent;
  readonly labelKey: string;
  readonly icon: IconDefinition;
  readonly enabled?: boolean;
  readonly hidden?: boolean;
  readonly children?: readonly IRoute[];
}

export default IRoute;
