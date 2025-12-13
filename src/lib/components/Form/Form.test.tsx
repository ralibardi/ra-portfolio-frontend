/**
 * Form Components Property-Based Tests
 *
 * These tests verify the correctness properties of the Form components
 * using fast-check for property-based testing.
 *
 * @module lib/components/Form/Form.property.test
 */

import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import {
  errorMessageArb,
  helperTextArb,
  inputValueArb,
  labelTextArb,
  PBT_CONFIG,
  placeholderTextArb,
} from '../../testing/property-testing';
import { fireEvent, renderComponent, screen } from '../../testing/render-utils';
import { Checkbox, Input, RadioGroup, Select } from './index';

// ============================================================================
// Custom Arbitraries for Form Components
// ============================================================================

/**
 * Arbitrary for select options
 */
const selectOptionArb = fc.record({
  value: fc.uuid(),
  label: labelTextArb,
  disabled: fc.boolean(),
});

// selectOptionsArb available for future use with Select component tests
const _selectOptionsArb = fc.array(selectOptionArb, { minLength: 2, maxLength: 10 });

// ============================================================================
// Property 14: Input field rendering
// Feature: reusable-component-library, Property 14: Input field rendering
// ============================================================================
describe('Property 14: Input field rendering', () => {
  /**
   * **Validates: Requirements 2.1**
   *
   * For any Input component with label, placeholder, and helperText props,
   * all three elements should be rendered in the DOM and properly associated
   * with the input.
   */
  test('Input should render label, placeholder, and helper text', () => {
    fc.assert(
      fc.property(
        fc.record({
          label: labelTextArb,
          placeholder: placeholderTextArb.filter((s) => s.length > 0),
          helperText: helperTextArb.filter((s) => s.length > 0),
          value: inputValueArb,
        }),
        ({ label, placeholder, helperText, value }) => {
          const handleChange = jest.fn();
          const { container, unmount } = renderComponent(
            <Input
              label={label}
              placeholder={placeholder}
              helperText={helperText}
              value={value}
              onChange={handleChange}
            />,
          );

          // Label should be rendered
          const labelElement = container.querySelector('label');
          expect(labelElement).toBeInTheDocument();
          expect(labelElement?.textContent).toContain(label);

          // Input should have placeholder
          const input = screen.getByTestId('input');
          expect(input).toHaveAttribute('placeholder', placeholder);

          // Helper text should be rendered
          const helperElement = container.querySelector('[class*="helperText"]');
          expect(helperElement).toBeInTheDocument();
          expect(helperElement?.textContent).toBe(helperText);

          // Label should be associated with input via htmlFor
          expect(labelElement).toHaveAttribute('for');
          expect(input).toHaveAttribute('id', labelElement?.getAttribute('for'));

          unmount();
        },
      ),
      PBT_CONFIG,
    );
  });
});

// ============================================================================
// Property 15: Input error display
// Feature: reusable-component-library, Property 15: Input error display
// ============================================================================
describe('Property 15: Input error display', () => {
  /**
   * **Validates: Requirements 2.2**
   *
   * For any Input component with an error prop, the error message should be
   * displayed with error styling and the input should have error state styling.
   */
  test('Input with error should display error message and have error styling', () => {
    fc.assert(
      fc.property(
        fc.record({
          label: labelTextArb,
          error: errorMessageArb,
          value: inputValueArb,
        }),
        ({ label, error, value }) => {
          const handleChange = jest.fn();
          const { container, unmount } = renderComponent(
            <Input label={label} error={error} value={value} onChange={handleChange} />,
          );

          // Error message should be rendered (use role="alert" to find the error span specifically)
          const errorElement = container.querySelector('[role="alert"]');
          expect(errorElement).toBeInTheDocument();
          expect(errorElement?.textContent).toBe(error);

          // Input should have error styling
          const input = screen.getByTestId('input');
          expect(input).toHaveClass('input--error');

          // Input should have aria-invalid
          expect(input).toHaveAttribute('aria-invalid', 'true');

          // Error should have role="alert"
          expect(errorElement).toHaveAttribute('role', 'alert');

          unmount();
        },
      ),
      PBT_CONFIG,
    );
  });
});

// ============================================================================
// Property 16: Select keyboard navigation
// Feature: reusable-component-library, Property 16: Select keyboard navigation
// ============================================================================
describe('Property 16: Select keyboard navigation', () => {
  /**
   * **Validates: Requirements 2.3**
   *
   * For any Select component, pressing arrow keys should navigate through
   * options and pressing Enter should select the focused option.
   */
  test('Select should support keyboard navigation with arrow keys and Enter', () => {
    // Use a fixed set of options for predictable testing
    const options = [
      { value: 'opt1', label: 'Option 1', disabled: false },
      { value: 'opt2', label: 'Option 2', disabled: false },
      { value: 'opt3', label: 'Option 3', disabled: false },
    ];

    const handleChange = jest.fn();
    const { unmount } = renderComponent(
      <Select
        label="Test Select"
        value=""
        onChange={handleChange}
        options={options}
        placeholder="Select an option"
      />,
    );

    const trigger = screen.getByTestId('select-trigger');

    // Open dropdown with ArrowDown (this opens and focuses first option)
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(screen.getByTestId('select-listbox')).toBeInTheDocument();

    // Select with Enter (first option should be focused)
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(handleChange).toHaveBeenCalledWith('opt1');

    unmount();
  });

  test('Select should close on Escape key', () => {
    const options = [
      { value: 'opt1', label: 'Option 1', disabled: false },
      { value: 'opt2', label: 'Option 2', disabled: false },
    ];

    const handleChange = jest.fn();
    const { unmount } = renderComponent(
      <Select label="Test Select" value="" onChange={handleChange} options={options} />,
    );

    const trigger = screen.getByTestId('select-trigger');

    // Open dropdown
    fireEvent.click(trigger);
    expect(screen.getByTestId('select-listbox')).toBeInTheDocument();

    // Close with Escape
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(screen.queryByTestId('select-listbox')).not.toBeInTheDocument();

    unmount();
  });
});

// ============================================================================
// Property 17: Checkbox indeterminate state
// Feature: reusable-component-library, Property 17: Checkbox indeterminate state
// ============================================================================
describe('Property 17: Checkbox indeterminate state', () => {
  /**
   * **Validates: Requirements 2.4**
   *
   * For any Checkbox component with indeterminate=true, the checkbox input
   * element should have the indeterminate property set to true.
   */
  test('Checkbox with indeterminate=true should have indeterminate property', () => {
    fc.assert(
      fc.property(labelTextArb, (label) => {
        const handleChange = jest.fn();
        const { unmount } = renderComponent(
          <Checkbox label={label} checked={false} onChange={handleChange} indeterminate={true} />,
        );

        const input = screen.getByTestId('checkbox-input') as HTMLInputElement;

        // Input should have indeterminate property set
        expect(input.indeterminate).toBe(true);

        // Visual checkbox should have indeterminate class
        const checkbox = document.querySelector('[class*="checkbox--indeterminate"]');
        expect(checkbox).toBeInTheDocument();

        unmount();
      }),
      PBT_CONFIG,
    );
  });

  test('Checkbox without indeterminate should not have indeterminate property', () => {
    fc.assert(
      fc.property(
        fc.record({
          label: labelTextArb,
          checked: fc.boolean(),
        }),
        ({ label, checked }) => {
          const handleChange = jest.fn();
          const { unmount } = renderComponent(
            <Checkbox
              label={label}
              checked={checked}
              onChange={handleChange}
              indeterminate={false}
            />,
          );

          const input = screen.getByTestId('checkbox-input') as HTMLInputElement;

          // Input should not have indeterminate property set
          expect(input.indeterminate).toBe(false);

          unmount();
        },
      ),
      PBT_CONFIG,
    );
  });
});

// ============================================================================
// Property 18: Radio group exclusivity
// Feature: reusable-component-library, Property 18: Radio group exclusivity
// ============================================================================
describe('Property 18: Radio group exclusivity', () => {
  /**
   * **Validates: Requirements 2.5**
   *
   * For any RadioGroup component, selecting one radio button should
   * automatically deselect all other radio buttons in the same group.
   */
  test('RadioGroup should only allow one selection at a time', () => {
    const options = [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2' },
      { value: 'opt3', label: 'Option 3' },
    ];

    let currentValue = 'opt1';
    const handleChange = jest.fn((value: string) => {
      currentValue = value;
    });

    const { rerender, unmount } = renderComponent(
      <RadioGroup
        label="Test Group"
        name="test-group"
        value={currentValue}
        onChange={handleChange}
        options={options}
      />,
    );

    // Get all radio inputs
    const radioInputs = screen.getAllByTestId('radio-input') as HTMLInputElement[];

    // First option should be checked
    expect(radioInputs[0].checked).toBe(true);
    expect(radioInputs[1].checked).toBe(false);
    expect(radioInputs[2].checked).toBe(false);

    // Click second option
    fireEvent.click(radioInputs[1]);
    expect(handleChange).toHaveBeenCalledWith('opt2');

    // Rerender with new value
    rerender(
      <RadioGroup
        label="Test Group"
        name="test-group"
        value="opt2"
        onChange={handleChange}
        options={options}
      />,
    );

    // Now second option should be checked, others unchecked
    const updatedInputs = screen.getAllByTestId('radio-input') as HTMLInputElement[];
    expect(updatedInputs[0].checked).toBe(false);
    expect(updatedInputs[1].checked).toBe(true);
    expect(updatedInputs[2].checked).toBe(false);

    unmount();
  });
});

// ============================================================================
// Property 19: Required field indicator
// Feature: reusable-component-library, Property 19: Required field indicator
// ============================================================================
describe('Property 19: Required field indicator', () => {
  /**
   * **Validates: Requirements 2.7**
   *
   * For any form component with required=true, a required indicator should
   * be displayed and the input should have the required attribute.
   */
  test('Input with required=true should show indicator and have required attribute', () => {
    fc.assert(
      fc.property(labelTextArb, (label) => {
        const handleChange = jest.fn();
        const { container, unmount } = renderComponent(
          <Input label={label} value="" onChange={handleChange} required />,
        );

        // Required indicator should be visible
        const requiredIndicator = container.querySelector('[class*="required"]');
        expect(requiredIndicator).toBeInTheDocument();
        expect(requiredIndicator?.textContent).toBe('*');

        // Input should have required attribute
        const input = screen.getByTestId('input');
        expect(input).toHaveAttribute('required');
        expect(input).toHaveAttribute('aria-required', 'true');

        unmount();
      }),
      PBT_CONFIG,
    );
  });

  test('Checkbox with required=true should show indicator and have required attribute', () => {
    fc.assert(
      fc.property(labelTextArb, (label) => {
        const handleChange = jest.fn();
        const { container, unmount } = renderComponent(
          <Checkbox label={label} checked={false} onChange={handleChange} required />,
        );

        // Required indicator should be visible
        const requiredIndicator = container.querySelector('[class*="required"]');
        expect(requiredIndicator).toBeInTheDocument();
        expect(requiredIndicator?.textContent).toBe('*');

        // Input should have required attribute
        const input = screen.getByTestId('checkbox-input');
        expect(input).toHaveAttribute('required');
        expect(input).toHaveAttribute('aria-required', 'true');

        unmount();
      }),
      PBT_CONFIG,
    );
  });

  test('RadioGroup with required=true should show indicator', () => {
    const options = [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2' },
    ];

    fc.assert(
      fc.property(labelTextArb, (label) => {
        const handleChange = jest.fn();
        const { container, unmount } = renderComponent(
          <RadioGroup
            label={label}
            name="test-group"
            value=""
            onChange={handleChange}
            options={options}
            required
          />,
        );

        // Required indicator should be visible
        const requiredIndicator = container.querySelector('[class*="required"]');
        expect(requiredIndicator).toBeInTheDocument();
        expect(requiredIndicator?.textContent).toBe('*');

        // Fieldset should have data-required attribute
        const fieldset = screen.getByTestId('radiogroup-container');
        expect(fieldset).toHaveAttribute('data-required', 'true');

        unmount();
      }),
      PBT_CONFIG,
    );
  });
});
