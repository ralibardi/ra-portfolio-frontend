import type React from 'react';

export type ButtonSize = 'small' | 'medium' | 'large';

export type BaseButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
  label?: string;
  size?: ButtonSize;
};
