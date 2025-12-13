/**
 * Tests for Component Library Render Utilities
 *
 * @module lib/testing/render-utils.test
 */

import { useState } from 'react';
import { createUserEvent, renderComponent, renderComponentHook, screen } from './render-utils';

describe('Render Utilities', () => {
  describe('renderComponent', () => {
    it('should render a component with all providers', () => {
      const TestComponent = () => <button type="button">Test Button</button>;

      renderComponent(<TestComponent />);

      expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument();
    });

    it('should provide user event instance', async () => {
      const handleClick = jest.fn();
      const TestComponent = () => (
        <button type="button" onClick={handleClick}>
          Click Me
        </button>
      );

      const { user } = renderComponent(<TestComponent />);
      const button = screen.getByRole('button', { name: 'Click Me' });

      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should support initial route option', () => {
      const TestComponent = () => <div data-testid="test">Rendered</div>;

      renderComponent(<TestComponent />, { initialRoute: '/test-route' });

      expect(screen.getByTestId('test')).toBeInTheDocument();
    });
  });

  describe('renderComponentHook', () => {
    it('should render a hook with all providers', () => {
      const useTestHook = () => {
        const [count, setCount] = useState(0);
        return { count, increment: () => setCount((c) => c + 1) };
      };

      const { result } = renderComponentHook(() => useTestHook());

      expect(result.current.count).toBe(0);
    });

    it('should allow hook state updates', () => {
      const useTestHook = () => {
        const [count, setCount] = useState(0);
        return { count, increment: () => setCount((c) => c + 1) };
      };

      const { result } = renderComponentHook(() => useTestHook());

      // Use act from the render-utils
      const { act } = require('./render-utils');
      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(1);
    });
  });

  describe('createUserEvent', () => {
    it('should create a user event instance', () => {
      const user = createUserEvent();

      expect(user).toBeDefined();
      expect(typeof user.click).toBe('function');
      expect(typeof user.type).toBe('function');
    });
  });
});
