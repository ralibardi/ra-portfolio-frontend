import { IToggleProps } from './toggle-props';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface IToggleWithIconsProps extends IToggleProps {
  iconLeft?: IconDefinition;
  iconRight?: IconDefinition;
}
