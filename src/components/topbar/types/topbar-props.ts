import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface NavigationLink {
  readonly path: string;
  readonly icon: IconDefinition;
  readonly label: string;
}

export interface ITopbarProps {
  readonly routes: readonly NavigationLink[];
}
