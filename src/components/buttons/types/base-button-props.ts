import type React from 'react';

export type BaseButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
  label?: string;
};
