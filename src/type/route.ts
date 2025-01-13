import { FunctionComponent } from 'react';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

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
