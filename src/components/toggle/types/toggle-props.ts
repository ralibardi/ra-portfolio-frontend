import type { MouseEvent } from 'react';

export interface IToggleProps {
  checked?: boolean;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}
