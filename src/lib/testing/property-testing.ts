/**
 * Property-Based Testing Utilities
 *
 * Provides fast-check arbitraries and utilities for property-based testing
 * of component library components.
 *
 * @module lib/testing/property-testing
 */

import * as fc from 'fast-check';

/**
 * Configuration for property-based tests
 * Minimum 100 iterations as specified in the design document
 */
export const PBT_CONFIG: {
  numRuns: number;
  verbose: boolean;
  endOnFailure: boolean;
} = {
  numRuns: 100,
  verbose: false,
  endOnFailure: true,
};

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost';

/**
 * Button size types
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Icon position types
 */
export type IconPosition = 'left' | 'right';

/**
 * Alert severity types
 */
export type AlertSeverity = 'info' | 'success' | 'warning' | 'error';

/**
 * Tooltip/Popover placement types
 */
export type Placement = 'top' | 'bottom' | 'left' | 'right';

/**
 * Tabs orientation types
 */
export type TabsOrientation = 'horizontal' | 'vertical';

/**
 * Skeleton variant types
 */
export type SkeletonVariant = 'text' | 'circle' | 'rectangle';

/**
 * Spinner size types
 */
export type SpinnerSize = 'small' | 'medium' | 'large';

// ============================================================================
// Button Arbitraries
// ============================================================================

/**
 * Arbitrary for button variants
 */
export const buttonVariantArb: fc.Arbitrary<ButtonVariant> = fc.constantFrom(
  'primary',
  'secondary',
  'tertiary',
  'danger',
  'ghost',
);

/**
 * Arbitrary for button sizes
 */
export const buttonSizeArb: fc.Arbitrary<ButtonSize> = fc.constantFrom('small', 'medium', 'large');

/**
 * Arbitrary for icon positions
 */
export const iconPositionArb: fc.Arbitrary<IconPosition> = fc.constantFrom('left', 'right');

/**
 * Arbitrary for valid button text (non-empty, trimmed)
 */
export const buttonTextArb: fc.Arbitrary<string> = fc
  .string({ minLength: 1, maxLength: 50 })
  .filter((s) => s.trim().length > 0);

/**
 * Arbitrary for button props
 */
export interface ButtonPropsArbitrary {
  variant: ButtonVariant;
  size: ButtonSize;
  disabled: boolean;
  fullWidth: boolean;
  isLoading: boolean;
  children: string;
}

export const buttonPropsArb: fc.Arbitrary<ButtonPropsArbitrary> = fc.record({
  variant: buttonVariantArb,
  size: buttonSizeArb,
  disabled: fc.boolean(),
  fullWidth: fc.boolean(),
  isLoading: fc.boolean(),
  children: buttonTextArb,
});

// ============================================================================
// Form Arbitraries
// ============================================================================

/**
 * Arbitrary for valid input values (non-empty strings)
 */
export const inputValueArb: fc.Arbitrary<string> = fc.string({ minLength: 0, maxLength: 200 });

/**
 * Arbitrary for valid label text
 */
export const labelTextArb: fc.Arbitrary<string> = fc
  .string({ minLength: 1, maxLength: 100 })
  .filter((s) => s.trim().length > 0);

/**
 * Arbitrary for error messages
 */
export const errorMessageArb: fc.Arbitrary<string> = fc
  .string({ minLength: 1, maxLength: 200 })
  .filter((s) => s.trim().length > 0);

/**
 * Arbitrary for helper text
 */
export const helperTextArb: fc.Arbitrary<string> = fc.string({ minLength: 0, maxLength: 200 });

/**
 * Arbitrary for placeholder text
 */
export const placeholderTextArb: fc.Arbitrary<string> = fc.string({ minLength: 0, maxLength: 100 });

/**
 * Arbitrary for whitespace-only strings (for testing validation)
 */
export const whitespaceOnlyArb: fc.Arbitrary<string> = fc
  .array(fc.constantFrom(' ', '\t', '\n', '\r'), { minLength: 1, maxLength: 10 })
  .map((chars) => chars.join(''));

// ============================================================================
// Alert/Notification Arbitraries
// ============================================================================

/**
 * Arbitrary for alert severity
 */
export const alertSeverityArb: fc.Arbitrary<AlertSeverity> = fc.constantFrom(
  'info',
  'success',
  'warning',
  'error',
);

/**
 * Arbitrary for notification duration (in milliseconds)
 */
export const notificationDurationArb: fc.Arbitrary<number> = fc.integer({ min: 1000, max: 10000 });

// ============================================================================
// Tooltip/Popover Arbitraries
// ============================================================================

/**
 * Arbitrary for placement
 */
export const placementArb: fc.Arbitrary<Placement> = fc.constantFrom(
  'top',
  'bottom',
  'left',
  'right',
);

/**
 * Arbitrary for delay values (in milliseconds)
 */
export const delayArb: fc.Arbitrary<number> = fc.integer({ min: 0, max: 1000 });

// ============================================================================
// Tabs Arbitraries
// ============================================================================

/**
 * Arbitrary for tabs orientation
 */
export const tabsOrientationArb: fc.Arbitrary<TabsOrientation> = fc.constantFrom(
  'horizontal',
  'vertical',
);

/**
 * Arbitrary for tab item
 */
export interface TabItemArbitrary {
  id: string;
  label: string;
  disabled: boolean;
}

export const tabItemArb: fc.Arbitrary<TabItemArbitrary> = fc.record({
  id: fc.uuid(),
  label: labelTextArb,
  disabled: fc.boolean(),
});

/**
 * Arbitrary for array of tab items (at least 2 tabs)
 */
export const tabItemsArb: fc.Arbitrary<TabItemArbitrary[]> = fc.array(tabItemArb, {
  minLength: 2,
  maxLength: 10,
});

// ============================================================================
// Accordion Arbitraries
// ============================================================================

/**
 * Arbitrary for accordion item
 */
export interface AccordionItemArbitrary {
  id: string;
  header: string;
  disabled: boolean;
}

export const accordionItemArb: fc.Arbitrary<AccordionItemArbitrary> = fc.record({
  id: fc.uuid(),
  header: labelTextArb,
  disabled: fc.boolean(),
});

/**
 * Arbitrary for array of accordion items (at least 1 item)
 */
export const accordionItemsArb: fc.Arbitrary<AccordionItemArbitrary[]> = fc.array(
  accordionItemArb,
  { minLength: 1, maxLength: 10 },
);

// ============================================================================
// Loading Arbitraries
// ============================================================================

/**
 * Arbitrary for skeleton variant
 */
export const skeletonVariantArb: fc.Arbitrary<SkeletonVariant> = fc.constantFrom(
  'text',
  'circle',
  'rectangle',
);

/**
 * Arbitrary for spinner size
 */
export const spinnerSizeArb: fc.Arbitrary<SpinnerSize> = fc.constantFrom(
  'small',
  'medium',
  'large',
);

/**
 * Arbitrary for skeleton lines count
 */
export const skeletonLinesArb: fc.Arbitrary<number> = fc.integer({ min: 1, max: 10 });

// ============================================================================
// Pagination Arbitraries
// ============================================================================

/**
 * Arbitrary for pagination state
 */
export interface PaginationStateArbitrary {
  currentPage: number;
  totalPages: number;
}

export const paginationStateArb: fc.Arbitrary<PaginationStateArbitrary> = fc
  .integer({ min: 1, max: 100 })
  .chain((totalPages) =>
    fc.record({
      currentPage: fc.integer({ min: 1, max: totalPages }),
      totalPages: fc.constant(totalPages),
    }),
  );

// ============================================================================
// Breadcrumb Arbitraries
// ============================================================================

/**
 * Arbitrary for breadcrumb item
 */
export interface BreadcrumbItemArbitrary {
  label: string;
  href?: string;
}

export const breadcrumbItemArb: fc.Arbitrary<BreadcrumbItemArbitrary> = fc.record({
  label: labelTextArb,
  href: fc.option(fc.webUrl(), { nil: undefined }),
});

/**
 * Arbitrary for array of breadcrumb items (at least 1 item)
 */
export const breadcrumbItemsArb: fc.Arbitrary<BreadcrumbItemArbitrary[]> = fc.array(
  breadcrumbItemArb,
  { minLength: 1, maxLength: 8 },
);

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Runs a property-based test with the standard configuration.
 *
 * @param property - The property to test
 * @param config - Optional configuration overrides
 *
 * @example
 * ```tsx
 * runProperty(
 *   fc.property(buttonVariantArb, (variant) => {
 *     // Test assertion
 *     expect(variant).toBeDefined();
 *   })
 * );
 * ```
 */
export function runProperty<T>(
  property: fc.IProperty<T>,
  config: Partial<typeof PBT_CONFIG> = {},
): void {
  fc.assert(property, { ...PBT_CONFIG, ...config });
}

/**
 * Creates a property test with standard configuration.
 * Useful for creating reusable property tests.
 *
 * @param arbitrary - The arbitrary to use
 * @param predicate - The predicate function
 * @returns A configured property
 *
 * @example
 * ```tsx
 * const variantProperty = createProperty(
 *   buttonVariantArb,
 *   (variant) => variant.length > 0
 * );
 * runProperty(variantProperty);
 * ```
 */
export function createProperty<T>(
  arbitrary: fc.Arbitrary<T>,
  predicate: (value: T) => boolean | undefined,
): fc.IProperty<[T]> {
  return fc.property(arbitrary, predicate);
}

/**
 * Generates a sample value from an arbitrary for debugging.
 *
 * @param arbitrary - The arbitrary to sample from
 * @param count - Number of samples to generate
 * @returns Array of sample values
 *
 * @example
 * ```tsx
 * const samples = sampleArbitrary(buttonVariantArb, 5);
 * console.log(samples); // ['primary', 'secondary', 'danger', ...]
 * ```
 */
export function sampleArbitrary<T>(arbitrary: fc.Arbitrary<T>, count = 10): T[] {
  return fc.sample(arbitrary, count);
}

// Re-export fast-check for convenience
export { fc };
