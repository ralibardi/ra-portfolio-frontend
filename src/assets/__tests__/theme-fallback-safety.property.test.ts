/**
 * Feature: 7-1-css-modules-implementation, Property 8: Theme Fallback Safety
 *
 * For any CSS custom property reference, if the variable is undefined,
 * the system should fall back to a default theme value without breaking the layout
 *
 * **Validates: Requirements 8.5**
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

// Path to theme and abstracts files
const THEMES_PATH = path.resolve(__dirname, '../themes');
const ABSTRACTS_PATH = path.resolve(__dirname, '../abstracts');

// All CSS custom properties that should have fallback values defined
const CRITICAL_CSS_PROPERTIES = [
  '--accent-colour',
  '--text-colour',
  '--background-colour',
  '--surface-colour',
  '--border-colour',
  '--shadow-colour',
  '--focus-colour',
] as const;

// Properties that components commonly use and need fallbacks
const COMPONENT_USED_PROPERTIES = [
  '--surface-colour-hover',
  '--surface-colour-active',
  '--text-colour-muted',
  '--border-colour-strong',
  '--shadow-colour-strong',
  '--background-colour-alt',
  '--background-colour-elevated',
] as const;

describe('Property 8: Theme Fallback Safety', () => {
  let lightThemeContent: string;
  let darkThemeContent: string;
  let mixinsContent: string;
  let themeMixinsContent: string;
  let coloursContent: string;

  beforeAll(() => {
    lightThemeContent = fs.readFileSync(path.join(THEMES_PATH, '_light.scss'), 'utf-8');
    darkThemeContent = fs.readFileSync(path.join(THEMES_PATH, '_dark.scss'), 'utf-8');
    mixinsContent = fs.readFileSync(path.join(ABSTRACTS_PATH, '_mixins.scss'), 'utf-8');
    themeMixinsContent = fs.readFileSync(path.join(THEMES_PATH, '_theme-mixins.scss'), 'utf-8');
    coloursContent = fs.readFileSync(path.join(ABSTRACTS_PATH, '_colours.scss'), 'utf-8');
  });

  describe('Default theme is always applied', () => {
    it('should have light theme as the default fallback', () => {
      // The mixins file should define light theme colors as defaults
      expect(mixinsContent).toContain('light:');
      // Light theme should be the first/default in the theme-colors map
      const lightIndex = mixinsContent.indexOf('light:');
      const darkIndex = mixinsContent.indexOf('dark:');
      expect(lightIndex).toBeLessThan(darkIndex);
    });

    it('should define all critical CSS properties in the default (light) theme', () => {
      for (const property of CRITICAL_CSS_PROPERTIES) {
        expect(lightThemeContent).toContain(property);
      }
    });

    it('should define all component-used properties in the default (light) theme', () => {
      for (const property of COMPONENT_USED_PROPERTIES) {
        expect(lightThemeContent).toContain(property);
      }
    });
  });

  describe('Color values have valid fallback sources', () => {
    it('should reference valid color families in light theme', () => {
      // Light theme should use colors from defined color families
      expect(lightThemeContent).toContain('$primary');
      expect(lightThemeContent).toContain('$neutral');
      expect(lightThemeContent).toContain('$grey');
    });

    it('should reference valid color families in dark theme', () => {
      // Dark theme should use colors from defined color families
      expect(darkThemeContent).toContain('$primary');
      expect(darkThemeContent).toContain('$neutral');
      expect(darkThemeContent).toContain('$grey');
    });

    it('should have all referenced color families defined in colours file', () => {
      const colorFamilies = [
        '$primary',
        '$secondary',
        '$neutral',
        '$grey',
        '$success',
        '$warning',
        '$error',
        '$info',
      ];

      for (const family of colorFamilies) {
        expect(coloursContent).toContain(`${family}:`);
      }
    });
  });

  describe('Theme mixin provides safe fallback behavior', () => {
    it('should have a theme mixin that handles unknown modes gracefully', () => {
      // The theme mixin should have a warning for unknown modes
      expect(mixinsContent).toContain('@warn');
      expect(mixinsContent).toMatch(/Unsupported theme mode|Unknown theme mode/);
    });

    it('should define theme-colors map with both light and dark themes', () => {
      expect(mixinsContent).toContain('$theme-colors:');
      expect(mixinsContent).toContain('light:');
      expect(mixinsContent).toContain('dark:');
    });

    it('should iterate over theme colors safely using @each', () => {
      expect(mixinsContent).toContain('@each');
      expect(mixinsContent).toContain('$name');
      expect(mixinsContent).toContain('$value');
    });
  });

  describe('Theme-aware mixins use CSS variables with implicit fallbacks', () => {
    it('should use var() for theme-aware-surface mixin', () => {
      expect(mixinsContent).toContain('@mixin theme-aware-surface');
      expect(mixinsContent).toContain('var(--surface-colour)');
      expect(mixinsContent).toContain('var(--text-colour)');
      expect(mixinsContent).toContain('var(--border-colour)');
    });

    it('should use var() for theme-aware-focus mixin', () => {
      expect(mixinsContent).toContain('@mixin theme-aware-focus');
      expect(mixinsContent).toContain('var(--focus-colour)');
    });

    it('should use var() for theme-aware-elevation mixin', () => {
      expect(mixinsContent).toContain('@mixin theme-aware-elevation');
      expect(mixinsContent).toContain('var(--shadow-colour)');
    });
  });

  describe('Semantic colors have complete fallback chains', () => {
    const semanticStates = ['success', 'warning', 'error', 'info'];

    it('should define base, light, and dark variants for all semantic colors', () => {
      for (const state of semanticStates) {
        // Check in colours file
        expect(coloursContent).toContain(`$${state}:`);
        expect(coloursContent).toMatch(new RegExp(`\\$${state}:[\\s\\S]*base:`));
        expect(coloursContent).toMatch(new RegExp(`\\$${state}:[\\s\\S]*light:`));
        expect(coloursContent).toMatch(new RegExp(`\\$${state}:[\\s\\S]*dark:`));
      }
    });

    it('should expose semantic colors as CSS custom properties in light theme', () => {
      for (const state of semanticStates) {
        expect(lightThemeContent).toContain(`--${state}-colour:`);
        expect(lightThemeContent).toContain(`--${state}-colour-light:`);
        expect(lightThemeContent).toContain(`--${state}-colour-dark:`);
      }
    });

    it('should expose semantic colors as CSS custom properties in dark theme', () => {
      for (const state of semanticStates) {
        expect(darkThemeContent).toContain(`--${state}-colour:`);
        expect(darkThemeContent).toContain(`--${state}-colour-light:`);
        expect(darkThemeContent).toContain(`--${state}-colour-dark:`);
      }
    });
  });

  describe('Alpha color variants provide transparency fallbacks', () => {
    it('should define alpha variants for neutral colors', () => {
      expect(coloursContent).toContain('white-alpha-');
      expect(coloursContent).toContain('black-alpha-');
    });

    it('should define alpha variants for primary colors', () => {
      expect(coloursContent).toContain('alpha-08');
    });

    it('should use alpha variants for overlay and shadow colors', () => {
      // Light theme should use alpha colors for overlays
      expect(lightThemeContent).toContain('alpha');
      // Dark theme should use alpha colors for overlays
      expect(darkThemeContent).toContain('alpha');
    });
  });

  describe('Theme property completeness ensures no undefined values', () => {
    it('should have identical property sets in light and dark themes', () => {
      // Extract all CSS custom property definitions
      const lightProps = (lightThemeContent.match(/--[\w-]+:/g) || []).sort();
      const darkProps = (darkThemeContent.match(/--[\w-]+:/g) || []).sort();

      // Both themes should define exactly the same properties
      expect(lightProps.length).toBe(darkProps.length);
      expect(lightProps).toEqual(darkProps);
    });

    it('should have all properties defined with actual values (not empty)', () => {
      // Check that no property is defined with an empty value
      const emptyValuePattern = /--[\w-]+:\s*;/g;

      expect(lightThemeContent).not.toMatch(emptyValuePattern);
      expect(darkThemeContent).not.toMatch(emptyValuePattern);
    });

    it('should use map.get for safe color access', () => {
      // Both themes should use map.get for safe access to color maps
      expect(lightThemeContent).toContain('map.get');
      expect(darkThemeContent).toContain('map.get');
    });
  });

  describe('Theme mixins in theme-mixins.scss provide additional safety', () => {
    it('should define apply-theme mixin with mode validation', () => {
      expect(themeMixinsContent).toContain('@mixin apply-theme');
      expect(themeMixinsContent).toContain('@warn');
    });

    it('should define theme-surface mixin for consistent surface styling', () => {
      expect(themeMixinsContent).toContain('@mixin theme-surface');
      expect(themeMixinsContent).toContain('var(--surface-colour)');
    });

    it('should define theme-elevation mixin with level-based shadows', () => {
      expect(themeMixinsContent).toContain('@mixin theme-elevation');
      expect(themeMixinsContent).toContain('$level');
    });

    it('should define semantic-state mixin for consistent state styling', () => {
      expect(themeMixinsContent).toContain('@mixin semantic-state');
      expect(themeMixinsContent).toContain('success');
      expect(themeMixinsContent).toContain('warning');
      expect(themeMixinsContent).toContain('error');
      expect(themeMixinsContent).toContain('info');
    });
  });

  describe('Legacy support properties have fallbacks', () => {
    it('should define legacy grey variables in light theme', () => {
      expect(mixinsContent).toContain('--light-grey:');
      expect(mixinsContent).toContain('--grey:');
      expect(mixinsContent).toContain('--dark-grey:');
    });

    it('should define legacy grey variables in dark theme', () => {
      // Check in the dark theme section of mixins
      const darkSection = mixinsContent.substring(mixinsContent.indexOf('dark:'));
      expect(darkSection).toContain('--light-grey:');
      expect(darkSection).toContain('--grey:');
      expect(darkSection).toContain('--dark-grey:');
    });
  });
});
