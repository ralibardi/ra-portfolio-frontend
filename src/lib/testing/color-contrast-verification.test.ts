/**
 * Tests for Color Contrast Verification Utilities
 *
 * @module lib/testing/color-contrast-verification.test
 */

import {
  CONTRAST_REQUIREMENTS,
  formatContrastRatio,
  getContrastRatio,
  getLuminance,
  hexToRgb,
  parseColor,
  rgbStringToRgb,
  testContrast,
  testDesignSystemContrast,
} from './color-contrast-verification';

describe('Color Contrast Verification Utilities', () => {
  describe('hexToRgb', () => {
    it('should convert 6-digit hex colors', () => {
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('should convert 3-digit hex colors', () => {
      expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#0f0')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#00f')).toEqual({ r: 0, g: 0, b: 255 });
      expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('should handle hex colors without # prefix', () => {
      expect(hexToRgb('ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('f00')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should throw error for invalid hex colors', () => {
      expect(() => hexToRgb('#invalid')).toThrow('Invalid hex color format');
      expect(() => hexToRgb('#ff')).toThrow('Invalid hex color format');
      expect(() => hexToRgb('#fffffff')).toThrow('Invalid hex color format');
    });
  });

  describe('rgbStringToRgb', () => {
    it('should convert RGB strings', () => {
      expect(rgbStringToRgb('rgb(255, 0, 0)')).toEqual({ r: 255, g: 0, b: 0 });
      expect(rgbStringToRgb('rgb(0, 255, 0)')).toEqual({ r: 0, g: 255, b: 0 });
      expect(rgbStringToRgb('rgb(0, 0, 255)')).toEqual({ r: 0, g: 0, b: 255 });
      expect(rgbStringToRgb('rgb(255, 255, 255)')).toEqual({ r: 255, g: 255, b: 255 });
      expect(rgbStringToRgb('rgb(0, 0, 0)')).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('should handle RGB strings with varying whitespace', () => {
      expect(rgbStringToRgb('rgb(255,0,0)')).toEqual({ r: 255, g: 0, b: 0 });
      expect(rgbStringToRgb('rgb( 255 , 0 , 0 )')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should throw error for invalid RGB strings', () => {
      expect(() => rgbStringToRgb('invalid')).toThrow('Invalid RGB color format');
      expect(() => rgbStringToRgb('rgb(255, 0)')).toThrow('Invalid RGB color format');
      expect(() => rgbStringToRgb('rgb(255, 0, 0, 0)')).toThrow('Invalid RGB color format');
    });
  });

  describe('parseColor', () => {
    it('should parse hex colors', () => {
      expect(parseColor('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(parseColor('#f00')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should parse RGB colors', () => {
      expect(parseColor('rgb(255, 0, 0)')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should parse named colors', () => {
      expect(parseColor('black')).toEqual({ r: 0, g: 0, b: 0 });
      expect(parseColor('white')).toEqual({ r: 255, g: 255, b: 255 });
      expect(parseColor('red')).toEqual({ r: 255, g: 0, b: 0 });
      expect(parseColor('green')).toEqual({ r: 0, g: 128, b: 0 });
      expect(parseColor('blue')).toEqual({ r: 0, g: 0, b: 255 });
    });

    it('should handle case insensitive named colors', () => {
      expect(parseColor('BLACK')).toEqual({ r: 0, g: 0, b: 0 });
      expect(parseColor('White')).toEqual({ r: 255, g: 255, b: 255 });
      expect(parseColor('RED')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should throw error for unsupported colors', () => {
      expect(() => parseColor('invalid')).toThrow('Unsupported color format');
      expect(() => parseColor('hsl(0, 100%, 50%)')).toThrow('Unsupported color format');
    });
  });

  describe('getLuminance', () => {
    it('should calculate correct luminance for pure colors', () => {
      // White should have luminance of 1
      expect(getLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 3);

      // Black should have luminance of 0
      expect(getLuminance({ r: 0, g: 0, b: 0 })).toBeCloseTo(0, 3);

      // Red should have lower luminance than green
      const redLuminance = getLuminance({ r: 255, g: 0, b: 0 });
      const greenLuminance = getLuminance({ r: 0, g: 255, b: 0 });
      expect(greenLuminance).toBeGreaterThan(redLuminance);
    });

    it('should handle gamma correction correctly', () => {
      // Test with a mid-range color
      const luminance = getLuminance({ r: 128, g: 128, b: 128 });
      expect(luminance).toBeGreaterThan(0);
      expect(luminance).toBeLessThan(1);
    });
  });

  describe('getContrastRatio', () => {
    it('should calculate maximum contrast for black and white', () => {
      const black = { r: 0, g: 0, b: 0 };
      const white = { r: 255, g: 255, b: 255 };

      const ratio = getContrastRatio(black, white);
      expect(ratio).toBeCloseTo(21, 1); // Maximum possible contrast ratio
    });

    it('should calculate minimum contrast for identical colors', () => {
      const color = { r: 128, g: 128, b: 128 };

      const ratio = getContrastRatio(color, color);
      expect(ratio).toBeCloseTo(1, 3); // Minimum possible contrast ratio
    });

    it('should be symmetric (order should not matter)', () => {
      const color1 = { r: 255, g: 0, b: 0 };
      const color2 = { r: 0, g: 255, b: 0 };

      const ratio1 = getContrastRatio(color1, color2);
      const ratio2 = getContrastRatio(color2, color1);

      expect(ratio1).toBeCloseTo(ratio2, 3);
    });
  });

  describe('testContrast', () => {
    it('should pass AAA for black text on white background', () => {
      const result = testContrast('#000000', '#ffffff');

      expect(result.ratio).toBeCloseTo(21, 1);
      expect(result.passes.AA_NORMAL).toBe(true);
      expect(result.passes.AA_LARGE).toBe(true);
      expect(result.passes.AAA_NORMAL).toBe(true);
      expect(result.passes.AAA_LARGE).toBe(true);
      expect(result.grade).toBe('AAA');
    });

    it('should fail for low contrast combinations', () => {
      const result = testContrast('#cccccc', '#ffffff');

      expect(result.ratio).toBeLessThan(CONTRAST_REQUIREMENTS.AA_NORMAL);
      expect(result.passes.AA_NORMAL).toBe(false);
      expect(result.grade).toBe('FAIL');
    });

    it('should pass AA but not AAA for medium contrast', () => {
      // This combination should pass AA but not AAA
      const result = testContrast('#767676', '#ffffff');

      expect(result.passes.AA_NORMAL).toBe(true);
      expect(result.passes.AAA_NORMAL).toBe(false);
      expect(result.grade).toBe('AA');
    });

    it('should handle different color formats', () => {
      const result1 = testContrast('#000000', '#ffffff');
      const result2 = testContrast('black', 'white');
      const result3 = testContrast('rgb(0, 0, 0)', 'rgb(255, 255, 255)');

      expect(result1.ratio).toBeCloseTo(result2.ratio, 1);
      expect(result2.ratio).toBeCloseTo(result3.ratio, 1);
    });
  });

  describe('formatContrastRatio', () => {
    it('should format AAA ratios correctly', () => {
      expect(formatContrastRatio(21)).toBe('21.00:1 (AAA)');
      expect(formatContrastRatio(7.5)).toBe('7.50:1 (AAA)');
    });

    it('should format AA ratios correctly', () => {
      expect(formatContrastRatio(4.5)).toBe('4.50:1 (AA)');
      expect(formatContrastRatio(6.9)).toBe('6.90:1 (AA)');
    });

    it('should format failing ratios correctly', () => {
      expect(formatContrastRatio(2.1)).toBe('2.10:1 (FAIL)');
      expect(formatContrastRatio(1.0)).toBe('1.00:1 (FAIL)');
    });

    it('should round to 2 decimal places', () => {
      expect(formatContrastRatio(4.567)).toBe('4.57:1 (AA)');
      expect(formatContrastRatio(4.561)).toBe('4.56:1 (AA)');
    });
  });

  describe('testDesignSystemContrast', () => {
    it('should test design system color combinations', () => {
      const results = testDesignSystemContrast();

      expect(results.length).toBeGreaterThan(0);

      // Each result should have the required properties
      for (const result of results) {
        expect(result).toHaveProperty('foreground');
        expect(result).toHaveProperty('background');
        expect(result).toHaveProperty('combination');
        expect(result).toHaveProperty('result');
        expect(result.result).toHaveProperty('ratio');
        expect(result.result).toHaveProperty('passes');
        expect(result.result).toHaveProperty('grade');
      }
    });

    it('should include black and white text combinations', () => {
      const results = testDesignSystemContrast();

      const blackTextResults = results.filter((r) => r.foreground === '#2c3e50');
      const whiteTextResults = results.filter((r) => r.foreground === '#fdfdfd');

      expect(blackTextResults.length).toBeGreaterThan(0);
      expect(whiteTextResults.length).toBeGreaterThan(0);
    });

    it('should test against various background colors', () => {
      const results = testDesignSystemContrast();

      const uniqueBackgrounds = new Set(results.map((r) => r.background));
      expect(uniqueBackgrounds.size).toBeGreaterThan(10); // Should test many background colors
    });
  });

  describe('CONTRAST_REQUIREMENTS', () => {
    it('should have correct WCAG 2.1 values', () => {
      expect(CONTRAST_REQUIREMENTS.AA_NORMAL).toBe(4.5);
      expect(CONTRAST_REQUIREMENTS.AA_LARGE).toBe(3.0);
      expect(CONTRAST_REQUIREMENTS.AA_UI).toBe(3.0);
      expect(CONTRAST_REQUIREMENTS.AAA_NORMAL).toBe(7.0);
      expect(CONTRAST_REQUIREMENTS.AAA_LARGE).toBe(4.5);
    });

    it('should have AAA requirements higher than AA', () => {
      expect(CONTRAST_REQUIREMENTS.AAA_NORMAL).toBeGreaterThan(CONTRAST_REQUIREMENTS.AA_NORMAL);
      expect(CONTRAST_REQUIREMENTS.AAA_LARGE).toBeGreaterThan(CONTRAST_REQUIREMENTS.AA_LARGE);
    });
  });

  describe('Real-world color combinations', () => {
    it('should validate common accessible combinations', () => {
      const accessibleCombinations = [
        { fg: '#000000', bg: '#ffffff', name: 'Black on white' },
        { fg: '#ffffff', bg: '#000000', name: 'White on black' },
        { fg: '#0066cc', bg: '#ffffff', name: 'Blue link on white' },
        { fg: '#ffffff', bg: '#0066cc', name: 'White on blue' },
      ];

      for (const combo of accessibleCombinations) {
        const result = testContrast(combo.fg, combo.bg);
        expect(result.passes.AA_NORMAL).toBe(true);
      }
    });

    it('should identify common inaccessible combinations', () => {
      const inaccessibleCombinations = [
        { fg: '#cccccc', bg: '#ffffff', name: 'Light gray on white' },
        { fg: '#ffff00', bg: '#ffffff', name: 'Yellow on white' },
        { fg: '#ff0000', bg: '#00ff00', name: 'Red on green' },
      ];

      for (const combo of inaccessibleCombinations) {
        const result = testContrast(combo.fg, combo.bg);
        expect(result.passes.AA_NORMAL).toBe(false);
      }
    });
  });
});
