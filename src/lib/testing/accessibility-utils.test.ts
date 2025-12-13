/**
 * Tests for Accessibility Testing Utilities
 *
 * @module lib/testing/accessibility-utils.test
 */

import {
  ARIA_ROLES,
  assertAriaCompliance,
  getAccessibleName,
  getAriaAttribute,
  getFocusableElements,
  hasAriaAttribute,
  isAnnouncedByScreenReader,
  isFocusable,
  KEYS,
  pressArrow,
  pressEnter,
  pressEscape,
  pressKey,
  pressSpace,
} from './accessibility-utils';

describe('Accessibility Testing Utilities', () => {
  describe('ARIA_ROLES', () => {
    it('should contain common ARIA roles', () => {
      expect(ARIA_ROLES.button).toBe('button');
      expect(ARIA_ROLES.dialog).toBe('dialog');
      expect(ARIA_ROLES.tab).toBe('tab');
      expect(ARIA_ROLES.tablist).toBe('tablist');
      expect(ARIA_ROLES.alert).toBe('alert');
    });
  });

  describe('KEYS', () => {
    it('should contain common keyboard keys', () => {
      expect(KEYS.Enter).toBe('Enter');
      expect(KEYS.Space).toBe(' ');
      expect(KEYS.Escape).toBe('Escape');
      expect(KEYS.Tab).toBe('Tab');
      expect(KEYS.ArrowUp).toBe('ArrowUp');
    });
  });

  describe('Key Press Functions', () => {
    let button: HTMLButtonElement;

    beforeEach(() => {
      button = document.createElement('button');
      button.type = 'button';
      document.body.appendChild(button);
    });

    afterEach(() => {
      document.body.removeChild(button);
    });

    it('pressKey should dispatch keydown and keyup events', () => {
      const keyDownHandler = jest.fn();
      const keyUpHandler = jest.fn();

      button.addEventListener('keydown', keyDownHandler);
      button.addEventListener('keyup', keyUpHandler);

      pressKey(button, 'Enter');

      expect(keyDownHandler).toHaveBeenCalled();
      expect(keyUpHandler).toHaveBeenCalled();
    });

    it('pressEnter should press Enter key', () => {
      const handler = jest.fn();
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handler();
      });

      pressEnter(button);

      expect(handler).toHaveBeenCalled();
    });

    it('pressSpace should press Space key', () => {
      const handler = jest.fn();
      button.addEventListener('keydown', (e) => {
        if (e.key === ' ') handler();
      });

      pressSpace(button);

      expect(handler).toHaveBeenCalled();
    });

    it('pressEscape should press Escape key', () => {
      const handler = jest.fn();
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') handler();
      });

      pressEscape(button);

      expect(handler).toHaveBeenCalled();
    });

    it('pressArrow should press arrow keys', () => {
      const directions: Array<'up' | 'down' | 'left' | 'right'> = ['up', 'down', 'left', 'right'];
      const expectedKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

      for (let i = 0; i < directions.length; i++) {
        const handler = jest.fn();
        button.addEventListener('keydown', (e) => {
          if (e.key === expectedKeys[i]) handler();
        });

        pressArrow(button, directions[i]);

        expect(handler).toHaveBeenCalled();
        button.removeEventListener('keydown', handler);
      }
    });
  });

  describe('ARIA Attribute Functions', () => {
    let element: HTMLDivElement;

    beforeEach(() => {
      element = document.createElement('div');
      element.setAttribute('aria-expanded', 'true');
      element.setAttribute('aria-label', 'Test Label');
    });

    it('hasAriaAttribute should check attribute value', () => {
      expect(hasAriaAttribute(element, 'expanded', 'true')).toBe(true);
      expect(hasAriaAttribute(element, 'expanded', 'false')).toBe(false);
      expect(hasAriaAttribute(element, 'aria-expanded', 'true')).toBe(true);
    });

    it('getAriaAttribute should return attribute value', () => {
      expect(getAriaAttribute(element, 'expanded')).toBe('true');
      expect(getAriaAttribute(element, 'label')).toBe('Test Label');
      expect(getAriaAttribute(element, 'nonexistent')).toBeNull();
    });
  });

  describe('Focus Functions', () => {
    let container: HTMLDivElement;

    beforeEach(() => {
      container = document.createElement('div');
      container.innerHTML = `
        <button type="button">Button 1</button>
        <input type="text" />
        <a href="#">Link</a>
        <button type="button" disabled>Disabled Button</button>
        <div tabindex="0">Focusable Div</div>
        <div tabindex="-1">Not Focusable Div</div>
        <span>Not Focusable Span</span>
      `;
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container);
    });

    it('isFocusable should identify focusable elements', () => {
      const button = container.querySelector('button:not([disabled])') as HTMLButtonElement;
      const input = container.querySelector('input') as HTMLInputElement;
      const link = container.querySelector('a') as HTMLAnchorElement;
      const disabledButton = container.querySelector('button[disabled]') as HTMLButtonElement;
      const focusableDiv = container.querySelector('[tabindex="0"]') as HTMLDivElement;
      const notFocusableDiv = container.querySelector('[tabindex="-1"]') as HTMLDivElement;
      const span = container.querySelector('span') as HTMLSpanElement;

      expect(isFocusable(button)).toBe(true);
      expect(isFocusable(input)).toBe(true);
      expect(isFocusable(link)).toBe(true);
      expect(isFocusable(disabledButton)).toBe(false);
      expect(isFocusable(focusableDiv)).toBe(true);
      expect(isFocusable(notFocusableDiv)).toBe(false);
      expect(isFocusable(span)).toBe(false);
    });

    it('getFocusableElements should return all focusable elements', () => {
      const focusableElements = getFocusableElements(container);

      // Should include: button, input, link, focusable div (not disabled button or tabindex=-1)
      expect(focusableElements.length).toBe(4);
    });
  });

  describe('Accessible Name Functions', () => {
    it('getAccessibleName should return aria-label', () => {
      const element = document.createElement('button');
      element.type = 'button';
      element.setAttribute('aria-label', 'Close dialog');

      expect(getAccessibleName(element)).toBe('Close dialog');
    });

    it('getAccessibleName should return text content as fallback', () => {
      const element = document.createElement('button');
      element.type = 'button';
      element.textContent = 'Submit';

      expect(getAccessibleName(element)).toBe('Submit');
    });
  });

  describe('Screen Reader Functions', () => {
    it('isAnnouncedByScreenReader should return false for aria-hidden elements', () => {
      const element = document.createElement('div');
      element.setAttribute('aria-hidden', 'true');

      expect(isAnnouncedByScreenReader(element)).toBe(false);
    });

    it('isAnnouncedByScreenReader should return false for presentation role', () => {
      const element = document.createElement('div');
      element.setAttribute('role', 'presentation');

      expect(isAnnouncedByScreenReader(element)).toBe(false);
    });

    it('isAnnouncedByScreenReader should return true for normal elements', () => {
      const element = document.createElement('div');
      element.textContent = 'Visible content';
      document.body.appendChild(element);

      expect(isAnnouncedByScreenReader(element)).toBe(true);

      document.body.removeChild(element);
    });
  });

  describe('ARIA Compliance Functions', () => {
    it('assertAriaCompliance should pass for correct role', () => {
      const element = document.createElement('div');
      element.setAttribute('role', 'dialog');
      element.setAttribute('aria-modal', 'true');

      expect(() => assertAriaCompliance(element, 'dialog', ['aria-modal'])).not.toThrow();
    });

    it('assertAriaCompliance should throw for incorrect role', () => {
      const element = document.createElement('div');
      element.setAttribute('role', 'button');

      expect(() => assertAriaCompliance(element, 'dialog')).toThrow(
        'Expected role "dialog" but got "button"',
      );
    });

    it('assertAriaCompliance should throw for missing required attributes', () => {
      const element = document.createElement('div');
      element.setAttribute('role', 'dialog');

      expect(() => assertAriaCompliance(element, 'dialog', ['aria-modal'])).toThrow(
        'Missing required ARIA attribute: aria-modal',
      );
    });
  });
});
