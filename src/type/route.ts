import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface IRoute {
  readonly path: string;
  readonly labelKey: string;
  readonly icon: IconDefinition;
  readonly enabled?: boolean;
  readonly hidden?: boolean;
}

export default IRoute;
