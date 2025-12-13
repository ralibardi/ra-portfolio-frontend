/**
 * Component Library Types
 *
 * Shared type definitions for the component library.
 *
 * @module lib/components/types
 */

import type { ButtonHTMLAttributes, ReactNode } from 'react';

// ============================================================================
// Common Types
// ============================================================================

/**
 * Common size variants used across components
 */
export type Size = 'small' | 'medium' | 'large';

/**
 * Common placement options for tooltips, popovers, etc.
 */
export type Placement = 'top' | 'bottom' | 'left' | 'right';

/**
 * Common orientation options
 */
export type Orientation = 'horizontal' | 'vertical';

/**
 * Common severity levels for alerts and notifications
 */
export type Severity = 'info' | 'success' | 'warning' | 'error';

// ============================================================================
// Button Types
// ============================================================================

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost';

/**
 * Icon position in button
 */
export type IconPosition = 'left' | 'right';

/**
 * Button component props
 */
export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'onError'> {
  /** Button content - optional for icon-only buttons */
  children?: ReactNode;
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size variant */
  size?: Size;
  /** Icon to display */
  icon?: ReactNode;
  /** Position of the icon */
  iconPosition?: IconPosition;
  /** Whether button takes full width */
  fullWidth?: boolean;
  /** Manual loading state control */
  isLoading?: boolean;
  /** Click handler - can return a Promise for automatic loading state */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  /** Error callback for async operations */
  onAsyncError?: (error: Error) => void;
}

// ============================================================================
// Form Types
// ============================================================================

/**
 * Base form field props shared across form components
 */
export interface BaseFormFieldProps {
  /** Field label */
  label: string;
  /** Helper text displayed below the field */
  helperText?: string;
  /** Error message - displays error state when provided */
  error?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Unique identifier */
  id?: string;
}

/**
 * Input component props
 */
export interface InputProps extends BaseFormFieldProps {
  /** Current value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  /** Placeholder text */
  placeholder?: string;
  /** ARIA describedby reference */
  'aria-describedby'?: string;
}

/**
 * Select option type
 */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Select component props
 */
export interface SelectProps extends BaseFormFieldProps {
  /** Current value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Available options */
  options: SelectOption[];
  /** Placeholder text */
  placeholder?: string;
}

/**
 * Checkbox component props
 */
export interface CheckboxProps extends Omit<BaseFormFieldProps, 'helperText'> {
  /** Whether checked */
  checked: boolean;
  /** Change handler */
  onChange: (checked: boolean) => void;
  /** Indeterminate state */
  indeterminate?: boolean;
  /** ARIA describedby reference */
  'aria-describedby'?: string;
}

/**
 * Radio option type
 */
export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Radio component props
 */
export interface RadioProps {
  /** Current value */
  value: string;
  /** Whether checked */
  checked: boolean;
  /** Change handler */
  onChange: (value: string) => void;
  /** Radio label */
  label: string;
  /** Radio group name */
  name: string;
  /** Whether disabled */
  disabled?: boolean;
  /** Unique identifier */
  id?: string;
}

/**
 * RadioGroup component props
 */
export interface RadioGroupProps {
  /** Current value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Group name */
  name: string;
  /** Available options */
  options: RadioOption[];
  /** Group label */
  label?: string;
  /** Error message */
  error?: string;
  /** Whether required */
  required?: boolean;
  /** Layout orientation */
  orientation?: Orientation;
}

// ============================================================================
// Accordion Types
// ============================================================================

/**
 * Accordion item type
 */
export interface AccordionItem {
  id: string;
  header: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

/**
 * Accordion component props
 */
export interface AccordionProps {
  /** Accordion items */
  items: AccordionItem[];
  /** Allow multiple sections to be expanded */
  allowMultiple?: boolean;
  /** Initially expanded section IDs */
  defaultExpanded?: string[];
  /** Change handler */
  onChange?: (expandedIds: string[]) => void;
  /** ARIA label */
  'aria-label'?: string;
}

// ============================================================================
// Breadcrumb Types
// ============================================================================

/**
 * Breadcrumb item type
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

/**
 * Breadcrumb component props
 */
export interface BreadcrumbProps {
  /** Breadcrumb items */
  items: BreadcrumbItem[];
  /** Custom separator */
  separator?: ReactNode;
  /** Maximum items to display before truncation */
  maxItems?: number;
  /** ARIA label */
  'aria-label'?: string;
}

// ============================================================================
// Modal Types
// ============================================================================

/**
 * Modal component props
 */
export interface ModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Modal content */
  children: ReactNode;
  /** Close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Close on Escape key */
  closeOnEscape?: boolean;
  /** ARIA labelledby reference */
  'aria-labelledby'?: string;
  /** ARIA describedby reference */
  'aria-describedby'?: string;
}

/**
 * Dialog size variants
 */
export type DialogSize = 'small' | 'medium' | 'large';

/**
 * Dialog component props
 */
export interface DialogProps {
  /** Whether dialog is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Dialog title */
  title: string;
  /** Dialog content */
  children: ReactNode;
  /** Footer content */
  footer?: ReactNode;
  /** Close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Close on Escape key */
  closeOnEscape?: boolean;
  /** Dialog size */
  size?: DialogSize;
}

// ============================================================================
// Tabs Types
// ============================================================================

/**
 * Tab item type
 */
export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

/**
 * Tabs component props
 */
export interface TabsProps {
  /** Tab items */
  items: TabItem[];
  /** Default selected index (uncontrolled) */
  defaultIndex?: number;
  /** Selected index (controlled) */
  selectedIndex?: number;
  /** Change handler */
  onChange?: (index: number) => void;
  /** Tab orientation */
  orientation?: Orientation;
  /** ARIA label */
  'aria-label'?: string;
}

// ============================================================================
// Alert Types
// ============================================================================

/**
 * Alert component props
 */
export interface AlertProps {
  /** Alert title */
  title?: string;
  /** Alert content */
  children: ReactNode;
  /** Severity level */
  severity: Severity;
  /** Close handler - shows close button when provided */
  onClose?: () => void;
  /** Custom icon override */
  icon?: ReactNode;
  /** ARIA role */
  role?: 'alert' | 'status';
}

/**
 * Notification position options
 */
export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

/**
 * Notification component props
 */
export interface NotificationProps {
  /** Notification title */
  title?: string;
  /** Notification message */
  message: string;
  /** Severity level */
  severity: Severity;
  /** Auto-dismiss duration in milliseconds */
  duration?: number;
  /** Close handler */
  onClose?: () => void;
  /** Position */
  position?: NotificationPosition;
}

/**
 * NotificationContainer component props
 */
export interface NotificationContainerProps {
  /** Position for notifications */
  position?: NotificationPosition;
  /** Maximum notifications to display */
  maxNotifications?: number;
}

// ============================================================================
// Tooltip Types
// ============================================================================

/**
 * Tooltip component props
 */
export interface TooltipProps {
  /** Tooltip content */
  content: ReactNode;
  /** Trigger element */
  children: React.ReactElement;
  /** Tooltip placement */
  placement?: Placement;
  /** Show delay in milliseconds */
  delay?: number;
  /** ARIA label */
  'aria-label'?: string;
}

/**
 * Popover trigger type
 */
export type PopoverTrigger = 'hover' | 'click';

/**
 * Popover component props
 */
export interface PopoverProps {
  /** Popover content */
  content: ReactNode;
  /** Trigger element */
  children: React.ReactElement;
  /** Popover placement */
  placement?: Placement;
  /** Trigger type */
  trigger?: PopoverTrigger;
  /** Close on click outside */
  closeOnClickOutside?: boolean;
  /** Controlled open state */
  isOpen?: boolean;
  /** Open state change handler */
  onOpenChange?: (isOpen: boolean) => void;
}

// ============================================================================
// Loading Types
// ============================================================================

/**
 * Skeleton variant types
 */
export type SkeletonVariant = 'text' | 'circle' | 'rectangle';

/**
 * Skeleton animation types
 */
export type SkeletonAnimation = 'pulse' | 'wave' | 'none';

/**
 * Skeleton component props
 */
export interface SkeletonProps {
  /** Skeleton variant */
  variant?: SkeletonVariant;
  /** Width */
  width?: string | number;
  /** Height */
  height?: string | number;
  /** Animation type */
  animation?: SkeletonAnimation;
  /** Number of lines (for text variant) */
  lines?: number;
}

/**
 * Spinner component props
 */
export interface SpinnerProps {
  /** Spinner size */
  size?: Size | number;
  /** Spinner color */
  color?: string;
  /** ARIA label */
  'aria-label'?: string;
}

// ============================================================================
// Pagination Types
// ============================================================================

/**
 * Pagination component props
 */
export interface PaginationProps {
  /** Current page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Page change handler */
  onPageChange: (page: number) => void;
  /** Pages to show on each side of current */
  siblingCount?: number;
  /** Pages to show at start/end */
  boundaryCount?: number;
  /** Previous button label */
  previousLabel?: string;
  /** Next button label */
  nextLabel?: string;
  /** Whether pagination is disabled */
  disabled?: boolean;
  /** ARIA label */
  'aria-label'?: string;
}
