/**
 * Component Library Utilities
 *
 * Utility functions and constants for the component library.
 * These are helpful for consumers who want to extend or customize components.
 *
 * @module lib/components/utils
 */

// ============================================================================
// Constants
// ============================================================================

/**
 * Default component sizes
 */
export const COMPONENT_SIZES = ['small', 'medium', 'large'] as const;

/**
 * Default button variants
 */
export const BUTTON_VARIANTS = ['primary', 'secondary', 'tertiary', 'danger', 'ghost'] as const;

/**
 * Default severity levels
 */
export const SEVERITY_LEVELS = ['info', 'success', 'warning', 'error'] as const;

/**
 * Default placement options
 */
export const PLACEMENT_OPTIONS = ['top', 'bottom', 'left', 'right'] as const;

/**
 * Default notification positions
 */
export const NOTIFICATION_POSITIONS = [
  'top-right',
  'top-left',
  'bottom-right',
  'bottom-left',
] as const;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if a value is a valid component size
 */
export const isValidSize = (value: string): value is 'small' | 'medium' | 'large' => {
  return COMPONENT_SIZES.includes(value as 'small' | 'medium' | 'large');
};

/**
 * Check if a value is a valid button variant
 */
export const isValidButtonVariant = (
  value: string,
): value is 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost' => {
  return BUTTON_VARIANTS.includes(value as 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost');
};

/**
 * Check if a value is a valid severity level
 */
export const isValidSeverity = (
  value: string,
): value is 'info' | 'success' | 'warning' | 'error' => {
  return SEVERITY_LEVELS.includes(value as 'info' | 'success' | 'warning' | 'error');
};

/**
 * Check if a value is a valid placement option
 */
export const isValidPlacement = (value: string): value is 'top' | 'bottom' | 'left' | 'right' => {
  return PLACEMENT_OPTIONS.includes(value as 'top' | 'bottom' | 'left' | 'right');
};

/**
 * Generate a unique ID for components
 * Useful for accessibility attributes and form field associations
 */
export const generateId = (prefix = 'component'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Combine class names conditionally
 * Simple utility for conditional className composition
 */
export const combineClassNames = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Debounce function for performance optimization
 * Useful for search inputs and other high-frequency events
 */
export const debounce = <T extends (...args: never[]) => unknown>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for performance optimization
 * Useful for scroll events and other continuous events
 */
export const throttle = <T extends (...args: never[]) => unknown>(
  func: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Common validation functions for form fields
 */
export const validators = {
  /**
   * Validate required field
   */
  required: (value: string): { isValid: boolean; error?: string } => ({
    isValid: Boolean(value?.trim()),
    error: !value?.trim() ? 'This field is required' : undefined,
  }),

  /**
   * Validate email format
   */
  email: (value: string): { isValid: boolean; error?: string } => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(value);
    return {
      isValid,
      error: !isValid ? 'Please enter a valid email address' : undefined,
    };
  },

  /**
   * Validate minimum length
   */
  minLength:
    (min: number) =>
    (value: string): { isValid: boolean; error?: string } => {
      const isValid = value.length >= min;
      return {
        isValid,
        error: !isValid ? `Must be at least ${min} characters long` : undefined,
      };
    },

  /**
   * Validate maximum length
   */
  maxLength:
    (max: number) =>
    (value: string): { isValid: boolean; error?: string } => {
      const isValid = value.length <= max;
      return {
        isValid,
        error: !isValid ? `Must be no more than ${max} characters long` : undefined,
      };
    },

  /**
   * Validate URL format
   */
  url: (value: string): { isValid: boolean; error?: string } => {
    try {
      new URL(value);
      return { isValid: true };
    } catch {
      return {
        isValid: false,
        error: 'Please enter a valid URL',
      };
    }
  },
};

/**
 * Combine multiple validators
 */
export const combineValidators = <T = string>(
  ...validators: Array<(value: T) => { isValid: boolean; error?: string }>
) => {
  return (value: T): { isValid: boolean; error?: string } => {
    for (const validator of validators) {
      const result = validator(value);
      if (!result.isValid) {
        return result;
      }
    }
    return { isValid: true };
  };
};
