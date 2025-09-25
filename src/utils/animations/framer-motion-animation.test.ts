import { fadeIn, slideIn, spring } from './framer-motion-animation';

describe('framer-motion-animation', () => {
  describe('fadeIn', () => {
    it('should have correct initial state', () => {
      expect(fadeIn.initial).toEqual({ opacity: 0 });
    });

    it('should have correct animate state', () => {
      expect(fadeIn.animate).toEqual({ opacity: 1 });
    });

    it('should have correct exit state', () => {
      expect(fadeIn.exit).toEqual({ opacity: 0 });
    });
  });

  describe('slideIn', () => {
    it('should have correct initial state', () => {
      expect(slideIn.initial).toEqual({ x: -100, opacity: 0 });
    });

    it('should have correct animate state', () => {
      expect(slideIn.animate).toEqual({ x: 0, opacity: 1 });
    });

    it('should have correct exit state', () => {
      expect(slideIn.exit).toEqual({ x: 100, opacity: 0 });
    });
  });

  describe('spring', () => {
    it('should have correct spring configuration', () => {
      expect(spring).toEqual({
        type: 'spring',
        stiffness: 700,
        damping: 30,
      });
    });

    it('should be a valid spring transition type', () => {
      expect(spring.type).toBe('spring');
      expect(typeof spring.stiffness).toBe('number');
      expect(typeof spring.damping).toBe('number');
    });
  });
});
