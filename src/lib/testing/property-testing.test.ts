/**
 * Tests for Property-Based Testing Utilities
 *
 * @module lib/testing/property-testing.test
 */

import {
  alertSeverityArb,
  buttonPropsArb,
  buttonSizeArb,
  buttonTextArb,
  buttonVariantArb,
  createProperty,
  fc,
  PBT_CONFIG,
  paginationStateArb,
  placementArb,
  runProperty,
  sampleArbitrary,
  skeletonVariantArb,
  spinnerSizeArb,
  tabsOrientationArb,
  whitespaceOnlyArb,
} from './property-testing';

describe('Property-Based Testing Utilities', () => {
  describe('PBT_CONFIG', () => {
    it('should have minimum 100 runs as specified in design document', () => {
      expect(PBT_CONFIG.numRuns).toBeGreaterThanOrEqual(100);
    });
  });

  describe('Button Arbitraries', () => {
    it('should generate valid button variants', () => {
      const validVariants = ['primary', 'secondary', 'tertiary', 'danger', 'ghost'];

      fc.assert(
        fc.property(buttonVariantArb, (variant) => {
          expect(validVariants).toContain(variant);
        }),
        { numRuns: 100 },
      );
    });

    it('should generate valid button sizes', () => {
      const validSizes = ['small', 'medium', 'large'];

      fc.assert(
        fc.property(buttonSizeArb, (size) => {
          expect(validSizes).toContain(size);
        }),
        { numRuns: 100 },
      );
    });

    it('should generate non-empty button text', () => {
      fc.assert(
        fc.property(buttonTextArb, (text) => {
          expect(text.trim().length).toBeGreaterThan(0);
        }),
        { numRuns: 100 },
      );
    });

    it('should generate valid button props objects', () => {
      fc.assert(
        fc.property(buttonPropsArb, (props) => {
          expect(props).toHaveProperty('variant');
          expect(props).toHaveProperty('size');
          expect(props).toHaveProperty('disabled');
          expect(props).toHaveProperty('fullWidth');
          expect(props).toHaveProperty('isLoading');
          expect(props).toHaveProperty('children');
        }),
        { numRuns: 100 },
      );
    });
  });

  describe('Alert Arbitraries', () => {
    it('should generate valid alert severities', () => {
      const validSeverities = ['info', 'success', 'warning', 'error'];

      fc.assert(
        fc.property(alertSeverityArb, (severity) => {
          expect(validSeverities).toContain(severity);
        }),
        { numRuns: 100 },
      );
    });
  });

  describe('Placement Arbitraries', () => {
    it('should generate valid placements', () => {
      const validPlacements = ['top', 'bottom', 'left', 'right'];

      fc.assert(
        fc.property(placementArb, (placement) => {
          expect(validPlacements).toContain(placement);
        }),
        { numRuns: 100 },
      );
    });
  });

  describe('Tabs Arbitraries', () => {
    it('should generate valid tabs orientations', () => {
      const validOrientations = ['horizontal', 'vertical'];

      fc.assert(
        fc.property(tabsOrientationArb, (orientation) => {
          expect(validOrientations).toContain(orientation);
        }),
        { numRuns: 100 },
      );
    });
  });

  describe('Loading Arbitraries', () => {
    it('should generate valid skeleton variants', () => {
      const validVariants = ['text', 'circle', 'rectangle'];

      fc.assert(
        fc.property(skeletonVariantArb, (variant) => {
          expect(validVariants).toContain(variant);
        }),
        { numRuns: 100 },
      );
    });

    it('should generate valid spinner sizes', () => {
      const validSizes = ['small', 'medium', 'large'];

      fc.assert(
        fc.property(spinnerSizeArb, (size) => {
          expect(validSizes).toContain(size);
        }),
        { numRuns: 100 },
      );
    });
  });

  describe('Whitespace Arbitrary', () => {
    it('should generate strings containing only whitespace', () => {
      fc.assert(
        fc.property(whitespaceOnlyArb, (str) => {
          expect(str.trim()).toBe('');
          expect(str.length).toBeGreaterThan(0);
        }),
        { numRuns: 100 },
      );
    });
  });

  describe('Pagination Arbitraries', () => {
    it('should generate valid pagination state with currentPage <= totalPages', () => {
      fc.assert(
        fc.property(paginationStateArb, (state) => {
          expect(state.currentPage).toBeGreaterThanOrEqual(1);
          expect(state.currentPage).toBeLessThanOrEqual(state.totalPages);
          expect(state.totalPages).toBeGreaterThanOrEqual(1);
        }),
        { numRuns: 100 },
      );
    });
  });

  describe('Utility Functions', () => {
    describe('runProperty', () => {
      it('should run a property with default configuration', () => {
        const property = fc.property(fc.integer(), (n) => {
          return typeof n === 'number';
        });

        // Should not throw
        expect(() => runProperty(property)).not.toThrow();
      });

      it('should allow configuration overrides', () => {
        const property = fc.property(fc.integer(), (n) => {
          return typeof n === 'number';
        });

        // Should not throw with custom config
        expect(() => runProperty(property, { numRuns: 50 })).not.toThrow();
      });
    });

    describe('createProperty', () => {
      it('should create a property from arbitrary and predicate', () => {
        const property = createProperty(buttonVariantArb, (variant) => {
          return variant.length > 0;
        });

        expect(() => runProperty(property)).not.toThrow();
      });
    });

    describe('sampleArbitrary', () => {
      it('should generate sample values from an arbitrary', () => {
        const samples = sampleArbitrary(buttonVariantArb, 5);

        expect(samples).toHaveLength(5);
        for (const sample of samples) {
          expect(['primary', 'secondary', 'tertiary', 'danger', 'ghost']).toContain(sample);
        }
      });

      it('should default to 10 samples', () => {
        const samples = sampleArbitrary(buttonSizeArb);

        expect(samples).toHaveLength(10);
      });
    });
  });
});
