/**
 * Tooltip Component Module
 *
 * Exports the Tooltip and Popover components for displaying contextual
 * information on hover, focus, or click.
 *
 * @module lib/components/Tooltip
 */

export type {
  Placement,
  PopoverProps,
  PopoverTrigger,
  TooltipProps,
} from '../types';
export { default as Popover } from './components/Popover';
export { default as Tooltip } from './components/Tooltip';
