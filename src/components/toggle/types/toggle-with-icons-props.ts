import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import type { IToggleProps } from './toggle-props';

export interface IToggleWithIconsProps extends IToggleProps {
  iconLeft?: IconDefinition;
  iconRight?: IconDefinition;
}
