/**
 * Color Contrast Verification Utilities
 *
 * Utilities for verifying color contrast ratios meet WCAG 2.1 AA standards.
 * These functions help with manual accessibility testing by calculating
 * contrast ratios and validating compliance.
 *
 * @module lib/testing/color-contrast-verification
 */

/**
 * WCAG 2.1 contrast ratio requirements
 */
export const CONTRAST_REQUIREMENTS = {
  AA_NORMAL: 4.5, // Normal text (< 18pt or < 14pt bold)
  AA_LARGE: 3.0, // Large text (≥ 18pt or ≥ 14pt bold)
  AA_UI: 3.0, // UI components and graphical objects
  AAA_NORMAL: 7.0, // Enhanced normal text
  AAA_LARGE: 4.5, // Enhanced large text
} as const;

/**
 * Color format types
 */
export type ColorFormat = 'hex' | 'rgb' | 'hsl';

/**
 * RGB color values
 */
export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/**
 * Contrast test result
 */
export interface ContrastResult {
  ratio: number;
  passes: {
    // biome-ignore lint/style/useNamingConvention: WCAG level naming convention
    AA_NORMAL: boolean;
    // biome-ignore lint/style/useNamingConvention: WCAG level naming convention
    AA_LARGE: boolean;
    // biome-ignore lint/style/useNamingConvention: WCAG level naming convention
    AA_UI: boolean;
    // biome-ignore lint/style/useNamingConvention: WCAG level naming convention
    AAA_NORMAL: boolean;
    // biome-ignore lint/style/useNamingConvention: WCAG level naming convention
    AAA_LARGE: boolean;
  };
  grade: 'AAA' | 'AA' | 'FAIL';
}

/**
 * Converts a hex color to RGB values.
 *
 * @param hex - Hex color string (e.g., "#ff0000" or "ff0000")
 * @returns RGB color object
 *
 * @example
 * ```ts
 * const rgb = hexToRgb("#ff0000");
 * console.log(rgb); // { r: 255, g: 0, b: 0 }
 * ```
 */
export function hexToRgb(hex: string): RGBColor {
  const cleanHex = hex.replace('#', '');

  if (cleanHex.length === 3) {
    // Short hex format (e.g., "f00")
    return {
      r: Number.parseInt(cleanHex[0] + cleanHex[0], 16),
      g: Number.parseInt(cleanHex[1] + cleanHex[1], 16),
      b: Number.parseInt(cleanHex[2] + cleanHex[2], 16),
    };
  }

  if (cleanHex.length === 6) {
    // Full hex format (e.g., "ff0000")
    return {
      r: Number.parseInt(cleanHex.substr(0, 2), 16),
      g: Number.parseInt(cleanHex.substr(2, 2), 16),
      b: Number.parseInt(cleanHex.substr(4, 2), 16),
    };
  }

  throw new Error(`Invalid hex color format: ${hex}`);
}

/**
 * Converts an RGB color string to RGB values.
 *
 * @param rgb - RGB color string (e.g., "rgb(255, 0, 0)")
 * @returns RGB color object
 *
 * @example
 * ```ts
 * const rgb = rgbStringToRgb("rgb(255, 0, 0)");
 * console.log(rgb); // { r: 255, g: 0, b: 0 }
 * ```
 */
export function rgbStringToRgb(rgb: string): RGBColor {
  const match = rgb.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
  if (!match) {
    throw new Error(`Invalid RGB color format: ${rgb}`);
  }

  return {
    r: Number.parseInt(match[1], 10),
    g: Number.parseInt(match[2], 10),
    b: Number.parseInt(match[3], 10),
  };
}

/**
 * Calculates the relative luminance of a color.
 * Based on WCAG 2.1 specification.
 *
 * @param color - RGB color object
 * @returns Relative luminance value (0-1)
 *
 * @example
 * ```ts
 * const luminance = getLuminance({ r: 255, g: 255, b: 255 });
 * console.log(luminance); // 1 (white)
 * ```
 */
export function getLuminance(color: RGBColor): number {
  // Convert RGB values to sRGB
  const rsRGB = color.r / 255;
  const gsRGB = color.g / 255;
  const bsRGB = color.b / 255;

  // Apply gamma correction
  const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : ((rsRGB + 0.055) / 1.055) ** 2.4;
  const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : ((gsRGB + 0.055) / 1.055) ** 2.4;
  const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : ((bsRGB + 0.055) / 1.055) ** 2.4;

  // Calculate relative luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculates the contrast ratio between two colors.
 * Based on WCAG 2.1 specification.
 *
 * @param color1 - First color (RGB)
 * @param color2 - Second color (RGB)
 * @returns Contrast ratio (1-21)
 *
 * @example
 * ```ts
 * const ratio = getContrastRatio(
 *   { r: 0, g: 0, b: 0 },     // black
 *   { r: 255, g: 255, b: 255 } // white
 * );
 * console.log(ratio); // 21 (maximum contrast)
 * ```
 */
export function getContrastRatio(color1: RGBColor, color2: RGBColor): number {
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);

  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Parses a color string and converts it to RGB.
 *
 * @param color - Color string in hex, rgb, or named format
 * @returns RGB color object
 *
 * @example
 * ```ts
 * const rgb1 = parseColor("#ff0000");
 * const rgb2 = parseColor("rgb(255, 0, 0)");
 * ```
 */
export function parseColor(color: string): RGBColor {
  const trimmedColor = color.trim().toLowerCase();

  // Handle hex colors
  if (trimmedColor.startsWith('#') || /^[0-9a-f]{3,6}$/i.test(trimmedColor)) {
    return hexToRgb(trimmedColor);
  }

  // Handle rgb colors
  if (trimmedColor.startsWith('rgb(')) {
    return rgbStringToRgb(trimmedColor);
  }

  // Handle named colors (basic set)
  const namedColors: Record<string, RGBColor> = {
    black: { r: 0, g: 0, b: 0 },
    white: { r: 255, g: 255, b: 255 },
    red: { r: 255, g: 0, b: 0 },
    green: { r: 0, g: 128, b: 0 },
    blue: { r: 0, g: 0, b: 255 },
    yellow: { r: 255, g: 255, b: 0 },
    cyan: { r: 0, g: 255, b: 255 },
    magenta: { r: 255, g: 0, b: 255 },
    gray: { r: 128, g: 128, b: 128 },
    grey: { r: 128, g: 128, b: 128 },
  };

  if (namedColors[trimmedColor]) {
    return namedColors[trimmedColor];
  }

  throw new Error(`Unsupported color format: ${color}`);
}

/**
 * Tests color contrast and returns detailed results.
 *
 * @param foreground - Foreground color string
 * @param background - Background color string
 * @returns Contrast test results
 *
 * @example
 * ```ts
 * const result = testContrast("#000000", "#ffffff");
 * console.log(result.ratio); // 21
 * console.log(result.passes.AA_NORMAL); // true
 * console.log(result.grade); // "AAA"
 * ```
 */
export function testContrast(foreground: string, background: string): ContrastResult {
  const fgColor = parseColor(foreground);
  const bgColor = parseColor(background);
  const ratio = getContrastRatio(fgColor, bgColor);

  const passes = {
    AA_NORMAL: ratio >= CONTRAST_REQUIREMENTS.AA_NORMAL,
    AA_LARGE: ratio >= CONTRAST_REQUIREMENTS.AA_LARGE,
    AA_UI: ratio >= CONTRAST_REQUIREMENTS.AA_UI,
    AAA_NORMAL: ratio >= CONTRAST_REQUIREMENTS.AAA_NORMAL,
    AAA_LARGE: ratio >= CONTRAST_REQUIREMENTS.AAA_LARGE,
  };

  let grade: 'AAA' | 'AA' | 'FAIL' = 'FAIL';
  if (passes.AAA_NORMAL) {
    grade = 'AAA';
  } else if (passes.AA_NORMAL) {
    grade = 'AA';
  }

  return {
    ratio: Math.round(ratio * 100) / 100, // Round to 2 decimal places
    passes,
    grade,
  };
}

/**
 * Gets the computed color of an element.
 *
 * @param element - DOM element
 * @param property - CSS property to get color from
 * @returns RGB color object
 *
 * @example
 * ```ts
 * const button = document.querySelector('button');
 * const textColor = getElementColor(button, 'color');
 * const bgColor = getElementColor(button, 'background-color');
 * ```
 */
export function getElementColor(element: HTMLElement, property: string): RGBColor {
  const computedStyle = window.getComputedStyle(element);
  const colorValue = computedStyle.getPropertyValue(property);

  if (!colorValue || colorValue === 'transparent') {
    // Default to white for transparent backgrounds, black for transparent text
    return property.includes('background') ? { r: 255, g: 255, b: 255 } : { r: 0, g: 0, b: 0 };
  }

  return parseColor(colorValue);
}

/**
 * Tests the contrast of an element against its background.
 *
 * @param element - DOM element to test
 * @returns Contrast test results
 *
 * @example
 * ```ts
 * const button = document.querySelector('button');
 * const result = testElementContrast(button);
 * console.log(`Contrast ratio: ${result.ratio}`);
 * console.log(`AA compliant: ${result.passes.AA_NORMAL}`);
 * ```
 */
export function testElementContrast(element: HTMLElement): ContrastResult {
  const textColor = getElementColor(element, 'color');
  const backgroundColor = getElementColor(element, 'background-color');

  const ratio = getContrastRatio(textColor, backgroundColor);

  const passes = {
    AA_NORMAL: ratio >= CONTRAST_REQUIREMENTS.AA_NORMAL,
    AA_LARGE: ratio >= CONTRAST_REQUIREMENTS.AA_LARGE,
    AA_UI: ratio >= CONTRAST_REQUIREMENTS.AA_UI,
    AAA_NORMAL: ratio >= CONTRAST_REQUIREMENTS.AAA_NORMAL,
    AAA_LARGE: ratio >= CONTRAST_REQUIREMENTS.AAA_LARGE,
  };

  let grade: 'AAA' | 'AA' | 'FAIL' = 'FAIL';
  if (passes.AAA_NORMAL) {
    grade = 'AAA';
  } else if (passes.AA_NORMAL) {
    grade = 'AA';
  }

  return {
    ratio: Math.round(ratio * 100) / 100,
    passes,
    grade,
  };
}

/**
 * Generates a contrast report for all text elements in a container.
 *
 * @param container - Container element to scan
 * @returns Array of contrast test results with element information
 *
 * @example
 * ```ts
 * const container = document.querySelector('.component');
 * const report = generateContrastReport(container);
 *
 * report.forEach(item => {
 *   if (!item.result.passes.AA_NORMAL) {
 *     console.warn(`Low contrast detected:`, item);
 *   }
 * });
 * ```
 */
export function generateContrastReport(container: HTMLElement): Array<{
  element: HTMLElement;
  tagName: string;
  className: string;
  textContent: string;
  result: ContrastResult;
}> {
  const textElements = container.querySelectorAll<HTMLElement>('*');
  const report: Array<{
    element: HTMLElement;
    tagName: string;
    className: string;
    textContent: string;
    result: ContrastResult;
  }> = [];

  for (const element of textElements) {
    // Skip elements without text content
    const textContent = element.textContent?.trim();
    if (!textContent) continue;

    // Skip elements that are hidden
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
      continue;
    }

    try {
      const result = testElementContrast(element);
      report.push({
        element,
        tagName: element.tagName.toLowerCase(),
        className: element.className,
        textContent: textContent.substring(0, 50) + (textContent.length > 50 ? '...' : ''),
        result,
      });
    } catch (_error) {
      // Intentionally ignore elements that fail contrast parsing/testing.
    }
  }

  return report;
}

/**
 * Common color combinations used in the design system.
 * These can be used for batch testing.
 */
export const DESIGN_SYSTEM_COLORS = {
  // Primary colors
  primary: {
    base: '#4a90e2',
    light: '#357abd',
    dark: '#2a5d9e',
  },

  // Secondary colors
  secondary: {
    base: '#e67e22',
    medium: '#d35400',
    accent: '#f1c40f',
  },

  // Neutral colors
  neutral: {
    white: '#fdfdfd',
    black: '#2c3e50',
  },

  // Grey scale
  grey: {
    100: '#ecf0f1',
    200: '#bdc3c7',
    300: '#95a5a6',
    400: '#7f8c8d',
    500: '#34495e',
    600: '#2c3e50',
  },

  // Semantic colors
  success: {
    base: '#10b981',
    light: '#34d399',
    dark: '#059669',
  },

  warning: {
    base: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
  },

  error: {
    base: '#ef4444',
    light: '#f87171',
    dark: '#dc2626',
  },

  info: {
    base: '#3b82f6',
    light: '#60a5fa',
    dark: '#2563eb',
  },
} as const;

/**
 * Tests all design system color combinations.
 *
 * @returns Array of contrast test results for design system colors
 *
 * @example
 * ```ts
 * const results = testDesignSystemContrast();
 * const failures = results.filter(r => !r.passes.AA_NORMAL);
 * console.log(`${failures.length} color combinations fail AA standards`);
 * ```
 */
export function testDesignSystemContrast(): Array<{
  foreground: string;
  background: string;
  combination: string;
  result: ContrastResult;
}> {
  const results: Array<{
    foreground: string;
    background: string;
    combination: string;
    result: ContrastResult;
  }> = [];

  const _colors = Object.values(DESIGN_SYSTEM_COLORS).flatMap((family) =>
    Object.entries(family).map(([name, color]) => ({ name, color })),
  );

  // Test text colors against background colors
  const textColors = [DESIGN_SYSTEM_COLORS.neutral.black, DESIGN_SYSTEM_COLORS.neutral.white];

  const backgroundColors = [
    ...Object.values(DESIGN_SYSTEM_COLORS.primary),
    ...Object.values(DESIGN_SYSTEM_COLORS.secondary),
    ...Object.values(DESIGN_SYSTEM_COLORS.grey),
    ...Object.values(DESIGN_SYSTEM_COLORS.success),
    ...Object.values(DESIGN_SYSTEM_COLORS.warning),
    ...Object.values(DESIGN_SYSTEM_COLORS.error),
    ...Object.values(DESIGN_SYSTEM_COLORS.info),
  ];

  for (const textColor of textColors) {
    for (const backgroundColor of backgroundColors) {
      const result = testContrast(textColor, backgroundColor);
      results.push({
        foreground: textColor,
        background: backgroundColor,
        combination: `${textColor} on ${backgroundColor}`,
        result,
      });
    }
  }

  return results;
}

/**
 * Utility function to format contrast ratio for display.
 *
 * @param ratio - Contrast ratio number
 * @returns Formatted string with ratio and grade
 *
 * @example
 * ```ts
 * const formatted = formatContrastRatio(4.5);
 * console.log(formatted); // "4.5:1 (AA)"
 * ```
 */
export function formatContrastRatio(ratio: number): string {
  let grade = 'FAIL';
  if (ratio >= CONTRAST_REQUIREMENTS.AAA_NORMAL) {
    grade = 'AAA';
  } else if (ratio >= CONTRAST_REQUIREMENTS.AA_NORMAL) {
    grade = 'AA';
  }

  return `${ratio.toFixed(2)}:1 (${grade})`;
}
