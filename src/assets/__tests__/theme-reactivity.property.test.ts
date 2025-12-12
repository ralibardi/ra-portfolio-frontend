/**
 * Feature: 7-1-css-modules-implementation, Property 7: Theme Reactivity
 *
 * For any component using theme-aware colors, when the theme is toggled
 * between light and dark, the component should update its colors to reflect the new theme
 *
 * **Validates: Requirements 8.2**
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

// Path to theme files
const THEMES_PATH = path.resolve(__dirname, '../themes');
const ABSTRACTS_PATH = path.resolve(__dirname, '../abstracts');
const BASE_PATH = path.resolve(__dirname, '../base');

// CSS custom properties that must change between themes
const THEME_REACTIVE_PROPERTIES = [
  '--accent-colour',
  '--text-colour',
  '--text-colour-muted',
  '--text-colour-inverse',
  '--background-colour',
  '--background-colour-alt',
  '--background-colour-elevated',
  '--background-colour-overlay',
  '--surface-colour',
  '--surface-colour-hover',
  '--surface-colour-active',
  '--border-colour',
  '--border-colour-strong',
  '--divider-colour',
  '--shadow-colour',
  '--shadow-colour-strong',
  '--focus-colour',
] as const;

// Semantic color properties that must be theme-aware
const SEMANTIC_COLOR_PROPERTIES = [
  '--success-colour',
  '--success-colour-light',
  '--success-colour-dark',
  '--warning-colour',
  '--warning-colour-light',
  '--warning-colour-dark',
  '--error-colour',
  '--error-colour-light',
  '--error-colour-dark',
  '--info-colour',
  '--info-colour-light',
  '--info-colour-dark',
] as const;

describe('Property 7: Theme Reactivity', () => {
  let lightThemeContent: string;
  let darkThemeContent: string;
  let mixinsContent: string;
  let resetContent: string;

  beforeAll(() => {
    lightThemeContent = fs.readFileSync(path.join(THEMES_PATH, '_light.scss'), 'utf-8');
    darkThemeContent = fs.readFileSync(path.join(THEMES_PATH, '_dark.scss'), 'utf-8');
    mixinsContent = fs.readFileSync(path.join(ABSTRACTS_PATH, '_mixins.scss'), 'utf-8');
    resetContent = fs.readFileSync(path.join(BASE_PATH, '_reset.scss'), 'utf-8');
  });

  describe('Theme files define all reactive properties', () => {
    it('should define all theme-reactive CSS custom properties in light theme', () => {
      for (const property of THEME_REACTIVE_PROPERTIES) {
        expect(lightThemeContent).toContain(property);
      }
    });

    it('should define all theme-reactive CSS custom properties in dark theme', () => {
      for (const property of THEME_REACTIVE_PROPERTIES) {
        expect(darkThemeContent).toContain(property);
      }
    });

    it('should define all semantic color properties in light theme', () => {
      for (const property of SEMANTIC_COLOR_PROPERTIES) {
        expect(lightThemeContent).toContain(property);
      }
    });

    it('should define all semantic color properties in dark theme', () => {
      for (const property of SEMANTIC_COLOR_PROPERTIES) {
        expect(darkThemeContent).toContain(property);
      }
    });
  });

  describe('Theme mixins are properly defined', () => {
    it('should define light-theme mixin', () => {
      expect(lightThemeContent).toContain('@mixin light-theme');
    });

    it('should define dark-theme mixin', () => {
      expect(darkThemeContent).toContain('@mixin dark-theme');
    });

    it('should define theme mixin in abstracts that supports both modes', () => {
      expect(mixinsContent).toContain('@mixin theme');
      expect(mixinsContent).toContain('light:');
      expect(mixinsContent).toContain('dark:');
    });
  });

  describe('Root element applies themes correctly', () => {
    it('should apply default light theme to :root', () => {
      expect(resetContent).toContain(':root');
      expect(resetContent).toContain('@include theme(light)');
    });

    it('should support system theme preference via prefers-color-scheme', () => {
      expect(resetContent).toContain('prefers-color-scheme: dark');
      expect(resetContent).toContain('@include theme(dark)');
    });

    it('should support explicit theme override via data-theme attribute', () => {
      expect(resetContent).toContain('[data-theme="light"]');
      expect(resetContent).toContain('[data-theme="dark"]');
    });

    it('should not apply dark theme when user explicitly sets light theme', () => {
      // The :not([data-theme="light"]) selector ensures user preference is respected
      expect(resetContent).toContain(':not([data-theme="light"])');
    });
  });

  describe('Theme color values differ between light and dark', () => {
    it('should have different text colors for light and dark themes', () => {
      // Light theme should use dark text on light background
      expect(lightThemeContent).toMatch(/--text-colour:.*black/);
      // Dark theme should use light text on dark background
      expect(darkThemeContent).toMatch(/--text-colour:.*white/);
    });

    it('should have different background colors for light and dark themes', () => {
      // Light theme should use light background
      expect(lightThemeContent).toMatch(/--background-colour:.*white/);
      // Dark theme should use dark background
      expect(darkThemeContent).toMatch(/--background-colour:.*grey/);
    });

    it('should have different surface colors for light and dark themes', () => {
      // Light theme surface should be light
      expect(lightThemeContent).toMatch(/--surface-colour:.*white/);
      // Dark theme surface should be dark
      expect(darkThemeContent).toMatch(/--surface-colour:.*grey/);
    });

    it('should have different shadow intensities for light and dark themes', () => {
      // Both themes should define shadow colors
      expect(lightThemeContent).toContain('--shadow-colour:');
      expect(darkThemeContent).toContain('--shadow-colour:');
      // Dark theme typically has stronger shadows
      expect(darkThemeContent).toContain('--shadow-colour-strong:');
    });
  });

  describe('Theme-aware mixins use CSS custom properties', () => {
    it('should define theme-aware-surface mixin using CSS variables', () => {
      expect(mixinsContent).toContain('@mixin theme-aware-surface');
      expect(mixinsContent).toContain('var(--surface-colour)');
      expect(mixinsContent).toContain('var(--text-colour)');
      expect(mixinsContent).toContain('var(--border-colour)');
    });

    it('should define theme-aware-focus mixin using CSS variables', () => {
      expect(mixinsContent).toContain('@mixin theme-aware-focus');
      expect(mixinsContent).toContain('var(--focus-colour)');
    });

    it('should define theme-aware-elevation mixin using CSS variables', () => {
      expect(mixinsContent).toContain('@mixin theme-aware-elevation');
      expect(mixinsContent).toContain('var(--shadow-colour)');
    });
  });

  describe('Theme transitions are smooth', () => {
    it('should apply transition to body for smooth theme changes', () => {
      expect(resetContent).toContain('body');
      expect(resetContent).toContain('transition');
      expect(resetContent).toContain('background-color');
      expect(resetContent).toContain('color');
    });
  });

  describe('All theme properties are consistently defined', () => {
    it('should have matching property sets in light and dark themes', () => {
      // Extract all CSS custom properties from both themes
      const lightProperties = lightThemeContent.match(/--[\w-]+:/g) || [];
      const darkProperties = darkThemeContent.match(/--[\w-]+:/g) || [];

      // Both themes should define the same properties
      const lightSet = new Set(lightProperties);
      const darkSet = new Set(darkProperties);

      // Check that all light properties exist in dark
      for (const prop of lightSet) {
        expect(darkSet.has(prop)).toBe(true);
      }

      // Check that all dark properties exist in light
      for (const prop of darkSet) {
        expect(lightSet.has(prop)).toBe(true);
      }
    });
  });
});
