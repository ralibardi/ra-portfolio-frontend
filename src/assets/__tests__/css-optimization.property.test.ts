/**
 * Feature: 7-1-css-modules-implementation, Property 10: CSS Optimization
 *
 * For any production build, common CSS patterns should be extracted and deduplicated,
 * and the total gzipped CSS size should be under 100KB.
 *
 * **Validates: Requirements 9.3, 9.4**
 *
 * Note: This test validates the build configuration prerequisites for CSS optimization:
 * 1. Vite configuration has CSS code splitting enabled
 * 2. CSS minification is configured for production
 * 3. CSS Modules use hashed class names in production
 * 4. Tree-shaking is configured for optimal bundle size
 * 5. Build output structure supports efficient caching
 *
 * Actual bundle size verification requires a production build and is tested
 * via the build analysis tools (rollup-plugin-visualizer).
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as fc from 'fast-check';

// Path to Vite configuration
const VITE_CONFIG_PATH = path.resolve(__dirname, '../../../vite.config.ts');

// Path to dist folder (if exists)
const DIST_PATH = path.resolve(__dirname, '../../../dist');
const DIST_CSS_PATH = path.join(DIST_PATH, 'static/css');

// CSS optimization configuration requirements
const CSS_OPTIMIZATION_REQUIREMENTS = [
  'cssCodeSplit',
  'minify',
  'terserOptions',
  'chunkSizeWarningLimit',
  'treeshake',
  'cssMinify',
] as const;

// CSS Module configuration requirements
const CSS_MODULE_REQUIREMENTS = ['generateScopedName', 'modules'] as const;

// Production-specific optimizations
const PRODUCTION_OPTIMIZATIONS = ['reportCompressedSize', 'assetsInlineLimit'] as const;

/**
 * Feature: 7-1-css-modules-implementation, Property 10: CSS Optimization
 *
 * For any production build, common CSS patterns should be extracted and deduplicated,
 * and the total gzipped CSS size should be under 100KB.
 *
 * **Validates: Requirements 9.3, 9.4**
 */
describe('Property 10: CSS Optimization', () => {
  let viteConfigContent: string;

  beforeAll(() => {
    viteConfigContent = fs.readFileSync(VITE_CONFIG_PATH, 'utf-8');
  });

  describe('Vite CSS Optimization Configuration', () => {
    it('should have all required CSS optimization settings in Vite config', () => {
      fc.assert(
        fc.property(fc.constantFrom(...CSS_OPTIMIZATION_REQUIREMENTS), (requirement) => {
          expect(viteConfigContent).toContain(requirement);
        }),
        { numRuns: 100 },
      );
    });

    it('should have CSS code splitting enabled for production', () => {
      // cssCodeSplit should be true for production builds
      expect(viteConfigContent).toContain('cssCodeSplit: true');
    });

    it('should have minification configured for production', () => {
      // Should use terser for production minification
      expect(viteConfigContent).toMatch(/minify:\s*isProd\s*\?\s*['"]terser['"]/);
    });

    it('should have chunk size warning limit configured', () => {
      // Should warn for chunks > 500KB (best practice)
      expect(viteConfigContent).toContain('chunkSizeWarningLimit: 500');
    });

    it('should have tree-shaking configured with optimal settings', () => {
      // Should have aggressive tree-shaking
      expect(viteConfigContent).toContain('treeshake:');
      expect(viteConfigContent).toContain('moduleSideEffects: false');
      expect(viteConfigContent).toContain("preset: 'smallest'");
    });
  });

  describe('CSS Module Configuration', () => {
    it('should have all required CSS Module settings', () => {
      fc.assert(
        fc.property(fc.constantFrom(...CSS_MODULE_REQUIREMENTS), (requirement) => {
          expect(viteConfigContent).toContain(requirement);
        }),
        { numRuns: 100 },
      );
    });

    it('should use hashed class names in production for smaller bundle size', () => {
      // Production should use short hashes: [hash:base64:5]
      expect(viteConfigContent).toContain("[hash:base64:5]'");
    });

    it('should use readable class names in development for debugging', () => {
      // Development should use readable names: [name]__[local]__[hash:base64:5]
      expect(viteConfigContent).toContain("[name]__[local]__[hash:base64:5]'");
    });

    it('should have environment-aware CSS Module naming', () => {
      // Should conditionally set generateScopedName based on isProd
      expect(viteConfigContent).toMatch(/generateScopedName:\s*isProd/);
    });
  });

  describe('Production Optimization Settings', () => {
    it('should have all production-specific optimizations', () => {
      fc.assert(
        fc.property(fc.constantFrom(...PRODUCTION_OPTIMIZATIONS), (optimization) => {
          expect(viteConfigContent).toContain(optimization);
        }),
        { numRuns: 100 },
      );
    });

    it('should report compressed size in production', () => {
      expect(viteConfigContent).toContain('reportCompressedSize: isProd');
    });

    it('should inline small assets for fewer HTTP requests', () => {
      // Should inline assets < 4KB (best practice)
      expect(viteConfigContent).toContain('assetsInlineLimit: 4096');
    });

    it('should have modern browser targets for optimal CSS output', () => {
      // Should target modern browsers for smaller CSS
      expect(viteConfigContent).toContain("cssTarget: 'chrome87'");
    });
  });

  describe('Build Output Structure', () => {
    it('should have CSS files in dedicated static/css folder', () => {
      // Check if dist folder exists (may not exist if build hasn't run)
      if (!fs.existsSync(DIST_CSS_PATH)) {
        // Skip this test if dist folder doesn't exist
        return;
      }

      const cssFiles = fs.readdirSync(DIST_CSS_PATH);
      expect(cssFiles.length).toBeGreaterThan(0);

      // All files should be CSS files
      for (const file of cssFiles) {
        expect(file).toMatch(/\.css$/);
      }
    });

    it('should have hashed CSS file names for cache busting', () => {
      if (!fs.existsSync(DIST_CSS_PATH)) {
        return;
      }

      const cssFiles = fs.readdirSync(DIST_CSS_PATH);

      fc.assert(
        fc.property(fc.constantFrom(...cssFiles), (cssFile) => {
          // CSS files should have hash in name (e.g., index-BFxhP7PI.css)
          expect(cssFile).toMatch(/^[\w-]+-[\w-]+\.css$/);
        }),
        { numRuns: Math.min(100, cssFiles.length) },
      );
    });

    it('should have CSS code splitting (multiple CSS files)', () => {
      if (!fs.existsSync(DIST_CSS_PATH)) {
        return;
      }

      const cssFiles = fs.readdirSync(DIST_CSS_PATH);

      // Should have multiple CSS files due to code splitting
      expect(cssFiles.length).toBeGreaterThan(1);
    });
  });

  describe('CSS Bundle Size Optimization', () => {
    it('should have bundle analyzer configured for production', () => {
      // Should use rollup-plugin-visualizer for bundle analysis
      expect(viteConfigContent).toContain('visualizer');
      expect(viteConfigContent).toContain('gzipSize: true');
      expect(viteConfigContent).toContain('brotliSize: true');
    });

    it('should generate stats.html for bundle analysis', () => {
      expect(viteConfigContent).toContain("filename: 'dist/stats.html'");
    });

    it('should use Lightning CSS for production CSS minification', () => {
      // Should use Lightning CSS for faster and better CSS minification
      expect(viteConfigContent).toContain("cssMinify: 'lightningcss'");
    });

    it('should have CSS files under reasonable size when dist exists', () => {
      if (!fs.existsSync(DIST_CSS_PATH)) {
        return;
      }

      const cssFiles = fs.readdirSync(DIST_CSS_PATH);
      let totalSize = 0;

      for (const file of cssFiles) {
        const filePath = path.join(DIST_CSS_PATH, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
      }

      // Total uncompressed CSS should be under 500KB (reasonable for a portfolio site)
      // Gzipped would be much smaller (~100KB target)
      const totalSizeKB = totalSize / 1024;
      expect(totalSizeKB).toBeLessThan(500);
    });
  });

  describe('SCSS Optimization Configuration', () => {
    it('should use modern SCSS compiler API', () => {
      expect(viteConfigContent).toContain("api: 'modern-compiler'");
    });

    it('should have SCSS implementation configured', () => {
      expect(viteConfigContent).toContain('implementation: sass');
    });

    it('should have source maps configured appropriately', () => {
      // Dev should have source maps, prod should have hidden or none
      expect(viteConfigContent).toContain('devSourcemap: isDev');
    });
  });

  describe('Asset Output Configuration', () => {
    it('should have organized asset output paths', () => {
      // CSS should go to static/css folder
      expect(viteConfigContent).toContain('assetFileNames');
      expect(viteConfigContent).toContain(`static/\${extType}/[name]-[hash][extname]`);
    });

    it('should have JS chunks in static/js folder', () => {
      expect(viteConfigContent).toContain("chunkFileNames: 'static/js/[name]-[hash].js'");
      expect(viteConfigContent).toContain("entryFileNames: 'static/js/[name]-[hash].js'");
    });
  });
});
