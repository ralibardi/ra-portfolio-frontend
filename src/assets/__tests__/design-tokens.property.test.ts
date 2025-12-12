/**
 * Feature: 7-1-css-modules-implementation, Property 2: Design Token Availability
 *
 * For any CSS Module that imports abstracts, all design tokens
 * (spacing, colors, typography, breakpoints, mixins) should be accessible and usable
 *
 * **Validates: Requirements 1.2, 2.2, 8.3**
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

// Design token categories that must be available in _variables.scss
const DESIGN_TOKEN_CATEGORIES = [
  '$spacing',
  '$border',
  '$percentage',
  '$transition',
  '$easing',
  '$z-index',
] as const;

const COLOR_FAMILIES = [
  'primary',
  'secondary',
  'neutral',
  'grey',
  'success',
  'warning',
  'error',
  'info',
] as const;

// Typography tokens that must be defined in _typography.scss
const TYPOGRAPHY_TOKENS = [
  '$font-family',
  '$font-weights',
  '$font-heights',
  '$font-sizes',
] as const;

// Mixins defined in _mixins.scss (breakpoint is in _breakpoints.scss)
const MIXIN_NAMES = [
  'theme',
  'font-style',
  'size',
  'flexbox',
  'box-shadow',
  'transition',
  'border-radius',
  'transform',
  'theme-aware-surface',
  'theme-aware-focus',
  'theme-aware-elevation',
] as const;

// Path to abstracts folder
const ABSTRACTS_PATH = path.resolve(__dirname, '../abstracts');

describe('Property 2: Design Token Availability', () => {
  describe('Abstracts folder structure', () => {
    it('should have all required abstract files', () => {
      const requiredFiles = [
        '_index.scss',
        '_variables.scss',
        '_colours.scss',
        '_typography.scss',
        '_mixins.scss',
        '_functions.scss',
        '_breakpoints.scss',
      ];

      for (const file of requiredFiles) {
        const filePath = path.join(ABSTRACTS_PATH, file);
        expect(fs.existsSync(filePath)).toBe(true);
      }
    });

    it('should have index file that forwards all abstracts', () => {
      const indexPath = path.join(ABSTRACTS_PATH, '_index.scss');
      const content = fs.readFileSync(indexPath, 'utf-8');

      // Index should forward all abstract modules
      expect(content).toContain("@forward 'variables'");
      expect(content).toContain("@forward 'colours'");
      expect(content).toContain("@forward 'typography'");
      expect(content).toContain("@forward 'mixins'");
      expect(content).toContain("@forward 'functions'");
      expect(content).toContain("@forward 'breakpoints'");
    });
  });

  describe('Variables token availability', () => {
    let variablesContent: string;

    beforeAll(() => {
      const variablesPath = path.join(ABSTRACTS_PATH, '_variables.scss');
      variablesContent = fs.readFileSync(variablesPath, 'utf-8');
    });

    it('should define all design token categories', () => {
      for (const category of DESIGN_TOKEN_CATEGORIES) {
        expect(variablesContent).toContain(`${category}:`);
      }
    });

    it('should define spacing scale with all required sizes', () => {
      const requiredSpacingSizes = [
        '0',
        "'3xs'",
        "'2xs'",
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        "'2xl'",
        "'3xl'",
        "'4xl'",
      ];

      expect(variablesContent).toContain('$spacing:');

      for (const size of requiredSpacingSizes) {
        expect(variablesContent).toContain(size);
      }
    });

    it('should define border scale', () => {
      expect(variablesContent).toContain('$border:');
      expect(variablesContent).toContain('xs:');
      expect(variablesContent).toContain('sm:');
      expect(variablesContent).toContain('md:');
      expect(variablesContent).toContain('lg:');
    });

    it('should define transition durations', () => {
      expect(variablesContent).toContain('$transition:');
      expect(variablesContent).toContain('fast:');
      expect(variablesContent).toContain('normal:');
      expect(variablesContent).toContain('slow:');
    });

    it('should define easing curves', () => {
      expect(variablesContent).toContain('$easing:');
      expect(variablesContent).toContain('ease:');
      expect(variablesContent).toContain('smooth:');
    });

    it('should define z-index layering system', () => {
      expect(variablesContent).toContain('$z-index:');
      expect(variablesContent).toContain('background:');
      expect(variablesContent).toContain('overlay:');
      expect(variablesContent).toContain('modal:');
      expect(variablesContent).toContain('toast:');
    });
  });

  describe('Color token availability', () => {
    let coloursContent: string;

    beforeAll(() => {
      const coloursPath = path.join(ABSTRACTS_PATH, '_colours.scss');
      coloursContent = fs.readFileSync(coloursPath, 'utf-8');
    });

    it('should define all color families', () => {
      for (const family of COLOR_FAMILIES) {
        expect(coloursContent).toContain(`$${family}:`);
      }
    });

    it('should define color variants for each family', () => {
      // Primary should have base, light, dark variants
      expect(coloursContent).toMatch(/\$primary:[\s\S]*base:/);
      expect(coloursContent).toMatch(/\$primary:[\s\S]*light:/);
      expect(coloursContent).toMatch(/\$primary:[\s\S]*dark:/);
    });

    it('should define semantic colors with all variants', () => {
      const semanticColors = ['success', 'warning', 'error', 'info'];

      for (const color of semanticColors) {
        expect(coloursContent).toContain(`$${color}:`);
      }
    });

    it('should define neutral colors with alpha variations', () => {
      expect(coloursContent).toContain('white:');
      expect(coloursContent).toContain('black:');
      expect(coloursContent).toContain('white-alpha-');
      expect(coloursContent).toContain('black-alpha-');
    });
  });

  describe('Typography token availability', () => {
    let typographyContent: string;

    beforeAll(() => {
      const typographyPath = path.join(ABSTRACTS_PATH, '_typography.scss');
      typographyContent = fs.readFileSync(typographyPath, 'utf-8');
    });

    it('should define all typography tokens', () => {
      for (const token of TYPOGRAPHY_TOKENS) {
        expect(typographyContent).toContain(`${token}:`);
      }
    });

    it('should define font family', () => {
      expect(typographyContent).toContain('$font-family:');
    });

    it('should define font weights scale', () => {
      expect(typographyContent).toContain('$font-weights:');
      expect(typographyContent).toContain('regular:');
      expect(typographyContent).toContain('medium:');
      expect(typographyContent).toContain('bold:');
    });

    it('should define font sizes scale', () => {
      expect(typographyContent).toContain('$font-sizes:');
      expect(typographyContent).toContain('xs:');
      expect(typographyContent).toContain('sm:');
      expect(typographyContent).toContain('md:');
      expect(typographyContent).toContain('lg:');
      expect(typographyContent).toContain('xl:');
    });

    it('should define line heights', () => {
      expect(typographyContent).toContain('$font-heights:');
      expect(typographyContent).toContain('normal:');
    });
  });

  describe('Mixin availability', () => {
    let mixinsContent: string;

    beforeAll(() => {
      const mixinsPath = path.join(ABSTRACTS_PATH, '_mixins.scss');
      mixinsContent = fs.readFileSync(mixinsPath, 'utf-8');
    });

    it('should define all required mixins', () => {
      for (const mixin of MIXIN_NAMES) {
        expect(mixinsContent).toContain(`@mixin ${mixin}`);
      }
    });

    it('should define theme color mappings for light and dark themes', () => {
      expect(mixinsContent).toContain('light:');
      expect(mixinsContent).toContain('dark:');
      expect(mixinsContent).toContain('--accent-colour:');
      expect(mixinsContent).toContain('--text-colour:');
      expect(mixinsContent).toContain('--background-colour:');
    });
  });

  describe('Breakpoint availability', () => {
    let breakpointsContent: string;

    beforeAll(() => {
      const breakpointsPath = path.join(ABSTRACTS_PATH, '_breakpoints.scss');
      breakpointsContent = fs.readFileSync(breakpointsPath, 'utf-8');
    });

    it('should define breakpoints map', () => {
      expect(breakpointsContent).toContain('$breakpoints:');
    });

    it('should define all required breakpoints', () => {
      const requiredBreakpoints = [
        'mobile-landscape',
        'tablet',
        'tablet-landscape',
        'laptop',
        'desktop',
      ];

      for (const bp of requiredBreakpoints) {
        expect(breakpointsContent).toContain(`'${bp}':`);
      }
    });

    it('should define breakpoint mixin', () => {
      expect(breakpointsContent).toContain('@mixin breakpoint');
    });
  });

  describe('Functions availability', () => {
    let functionsContent: string;

    beforeAll(() => {
      const functionsPath = path.join(ABSTRACTS_PATH, '_functions.scss');
      functionsContent = fs.readFileSync(functionsPath, 'utf-8');
    });

    it('should define utility functions', () => {
      expect(functionsContent).toContain('@function');
    });
  });
});
