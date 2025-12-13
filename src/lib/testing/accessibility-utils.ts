/**
 * Accessibility Testing Utilities
 *
 * Provides utilities for testing accessibility features of components,
 * including ARIA attributes, keyboard navigation, and focus management.
 *
 * @module lib/testing/accessibility-utils
 */

import { fireEvent } from '@testing-library/react';

/**
 * Common ARIA roles for component testing
 */
export const ARIA_ROLES = {
  button: 'button',
  checkbox: 'checkbox',
  dialog: 'dialog',
  alert: 'alert',
  alertdialog: 'alertdialog',
  tab: 'tab',
  tablist: 'tablist',
  tabpanel: 'tabpanel',
  listbox: 'listbox',
  option: 'option',
  textbox: 'textbox',
  combobox: 'combobox',
  navigation: 'navigation',
  tooltip: 'tooltip',
  status: 'status',
  progressbar: 'progressbar',
  region: 'region',
} as const;

/**
 * Common keyboard keys for testing keyboard navigation
 */
export const KEYS = {
  Enter: 'Enter',
  Space: ' ',
  Escape: 'Escape',
  Tab: 'Tab',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  Home: 'Home',
  End: 'End',
} as const;

/**
 * Simulates pressing a keyboard key on an element.
 *
 * @param element - The element to press the key on
 * @param key - The key to press
 *
 * @example
 * ```tsx
 * const button = screen.getByRole('button');
 * pressKey(button, KEYS.Enter);
 * ```
 */
export function pressKey(element: HTMLElement, key: string): void {
  fireEvent.keyDown(element, { key });
  fireEvent.keyUp(element, { key });
}

/**
 * Simulates pressing Enter on an element.
 *
 * @param element - The element to press Enter on
 */
export function pressEnter(element: HTMLElement): void {
  pressKey(element, KEYS.Enter);
}

/**
 * Simulates pressing Space on an element.
 *
 * @param element - The element to press Space on
 */
export function pressSpace(element: HTMLElement): void {
  pressKey(element, KEYS.Space);
}

/**
 * Simulates pressing Escape on an element.
 *
 * @param element - The element to press Escape on
 */
export function pressEscape(element: HTMLElement): void {
  pressKey(element, KEYS.Escape);
}

/**
 * Simulates pressing Tab to move focus forward.
 *
 * @param element - The element to press Tab on (defaults to document.activeElement)
 * @param shiftKey - Whether to hold Shift (for reverse tab)
 */
export function pressTab(element?: HTMLElement, shiftKey = false): void {
  const target = element || document.activeElement;
  if (target instanceof HTMLElement) {
    fireEvent.keyDown(target, { key: KEYS.Tab, shiftKey });
  }
}

/**
 * Simulates pressing arrow keys for navigation.
 *
 * @param element - The element to navigate from
 * @param direction - The direction to navigate
 */
export function pressArrow(
  element: HTMLElement,
  direction: 'up' | 'down' | 'left' | 'right',
): void {
  const keyMap = {
    up: KEYS.ArrowUp,
    down: KEYS.ArrowDown,
    left: KEYS.ArrowLeft,
    right: KEYS.ArrowRight,
  };
  pressKey(element, keyMap[direction]);
}

/**
 * Checks if an element has the expected ARIA attribute value.
 *
 * @param element - The element to check
 * @param attribute - The ARIA attribute name (without 'aria-' prefix)
 * @param expectedValue - The expected value
 * @returns Whether the attribute matches
 *
 * @example
 * ```tsx
 * const button = screen.getByRole('button');
 * expect(hasAriaAttribute(button, 'expanded', 'true')).toBe(true);
 * ```
 */
export function hasAriaAttribute(
  element: HTMLElement,
  attribute: string,
  expectedValue: string,
): boolean {
  const attrName = attribute.startsWith('aria-') ? attribute : `aria-${attribute}`;
  return element.getAttribute(attrName) === expectedValue;
}

/**
 * Gets the value of an ARIA attribute.
 *
 * @param element - The element to get the attribute from
 * @param attribute - The ARIA attribute name (without 'aria-' prefix)
 * @returns The attribute value or null
 */
export function getAriaAttribute(element: HTMLElement, attribute: string): string | null {
  const attrName = attribute.startsWith('aria-') ? attribute : `aria-${attribute}`;
  return element.getAttribute(attrName);
}

/**
 * Checks if an element is focusable.
 *
 * @param element - The element to check
 * @returns Whether the element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];

  return focusableSelectors.some((selector) => element.matches(selector));
}

/**
 * Gets all focusable elements within a container.
 *
 * @param container - The container element
 * @returns Array of focusable elements
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors));
}

/**
 * Checks if focus is trapped within a container (for modal testing).
 *
 * @param container - The container element
 * @returns Whether focus is trapped
 */
export function isFocusTrapped(container: HTMLElement): boolean {
  const focusableElements = getFocusableElements(container);
  if (focusableElements.length === 0) return false;

  const activeElement = document.activeElement;
  return container.contains(activeElement);
}

/**
 * Waits for an element to receive focus.
 *
 * @param element - The element to wait for
 * @param timeout - Maximum time to wait in milliseconds
 * @returns Promise that resolves when element is focused
 */
export async function waitForFocus(element: HTMLElement, timeout = 1000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.activeElement === element) {
      resolve();
      return;
    }

    const timeoutId = setTimeout(() => {
      reject(new Error(`Element did not receive focus within ${timeout}ms`));
    }, timeout);

    const handleFocus = () => {
      clearTimeout(timeoutId);
      element.removeEventListener('focus', handleFocus);
      resolve();
    };

    element.addEventListener('focus', handleFocus);
  });
}

/**
 * Checks if an element has a visible focus indicator.
 * Note: This is a basic check and may need to be enhanced based on your focus styles.
 *
 * @param element - The element to check
 * @returns Whether the element appears to have focus styling
 */
export function hasVisibleFocusIndicator(element: HTMLElement): boolean {
  const styles = window.getComputedStyle(element);

  // Check for common focus indicators
  const hasOutline = styles.outline !== 'none' && styles.outlineWidth !== '0px';
  const hasBoxShadow = styles.boxShadow !== 'none';
  const hasBorder = styles.borderWidth !== '0px';

  return hasOutline || hasBoxShadow || hasBorder;
}

/**
 * Gets the accessible name of an element.
 *
 * @param element - The element to get the name from
 * @returns The accessible name
 */
export function getAccessibleName(element: HTMLElement): string {
  // Check aria-label first
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  // Check aria-labelledby
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) return labelElement.textContent || '';
  }

  // Check for associated label (for form elements)
  if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement) {
    const id = element.id;
    if (id) {
      const label = document.querySelector<HTMLLabelElement>(`label[for="${id}"]`);
      if (label) return label.textContent || '';
    }
  }

  // Fall back to text content
  return element.textContent || '';
}

/**
 * Checks if an element is announced by screen readers.
 *
 * @param element - The element to check
 * @returns Whether the element would be announced
 */
export function isAnnouncedByScreenReader(element: HTMLElement): boolean {
  const ariaHidden = element.getAttribute('aria-hidden');
  if (ariaHidden === 'true') return false;

  const role = element.getAttribute('role');
  if (role === 'presentation' || role === 'none') return false;

  const styles = window.getComputedStyle(element);
  if (styles.display === 'none' || styles.visibility === 'hidden') return false;

  return true;
}

/**
 * Asserts that an element has the required ARIA attributes for a specific role.
 *
 * @param element - The element to check
 * @param role - The expected role
 * @param requiredAttributes - Array of required ARIA attributes
 */
export function assertAriaCompliance(
  element: HTMLElement,
  role: string,
  requiredAttributes: string[] = [],
): void {
  const actualRole = element.getAttribute('role');
  if (actualRole !== role) {
    throw new Error(`Expected role "${role}" but got "${actualRole}"`);
  }

  for (const attr of requiredAttributes) {
    const attrName = attr.startsWith('aria-') ? attr : `aria-${attr}`;
    if (!element.hasAttribute(attrName)) {
      throw new Error(`Missing required ARIA attribute: ${attrName}`);
    }
  }
}

/**
 * Helper to check reduced motion preference.
 * Useful for testing animation behavior.
 *
 * @returns Whether reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
