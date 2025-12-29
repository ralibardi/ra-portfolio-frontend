/**
 * Feature: Next.js CSS Optimization Assertions
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as fc from 'fast-check';

const NEXT_CONFIG_PATH = path.resolve(__dirname, '../../../next.config.ts');
const TAILWIND_CONFIG_PATH = path.resolve(__dirname, '../../../tailwind.config.ts');
const POSTCSS_CONFIG_PATH = path.resolve(__dirname, '../../../postcss.config.mjs');

describe('Property 10: CSS Optimization', () => {
  let nextConfigContent: string;
  let tailwindConfigContent: string;
  let postcssConfigContent: string;

  beforeAll(() => {
    nextConfigContent = fs.readFileSync(NEXT_CONFIG_PATH, 'utf-8');
    tailwindConfigContent = fs.readFileSync(TAILWIND_CONFIG_PATH, 'utf-8');
    postcssConfigContent = fs.readFileSync(POSTCSS_CONFIG_PATH, 'utf-8');
  });

  describe('Next.js optimization baseline', () => {
    it('enables strict mode and server actions', () => {
      expect(nextConfigContent).toContain('reactStrictMode: true');
      expect(nextConfigContent).toContain('serverActions');
    });

    it('keeps experimental server action settings small for optimized payloads', () => {
      expect(nextConfigContent).toContain("bodySizeLimit: '2mb'");
    });
  });

  describe('Tailwind CSS configuration', () => {
    it('tracks all application directories for purging', () => {
      const expectedGlobs = [
        "'./src/app/**/*.{ts,tsx}'",
        "'./src/components/**/*.{ts,tsx}'",
        "'./src/pages/**/*.{ts,tsx}'",
      ];

      fc.assert(
        fc.property(fc.constantFrom(...expectedGlobs), (glob) => {
          expect(tailwindConfigContent).toContain(glob);
        }),
        { numRuns: expectedGlobs.length },
      );
    });

    it('extends the theme with semantic brand colors', () => {
      expect(tailwindConfigContent).toContain('colors');
      expect(tailwindConfigContent).toContain('brand');
      expect(tailwindConfigContent).toContain('--color-brand');
    });

    it('defines custom radii for consistent corners', () => {
      expect(tailwindConfigContent).toContain('borderRadius');
      expect(tailwindConfigContent).toContain("xl: '1rem'");
    });
  });

  describe('PostCSS pipeline configuration', () => {
    it('includes tailwindcss and autoprefixer plugins', () => {
      expect(postcssConfigContent).toContain('tailwindcss');
      expect(postcssConfigContent).toContain('autoprefixer');
    });
  });
});
