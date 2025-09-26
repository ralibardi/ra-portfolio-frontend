import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import type { BaseButtonProps } from './base-button-props';

export interface IButtonWithIconProps extends BaseButtonProps {
  icon: IconDefinition;
}
