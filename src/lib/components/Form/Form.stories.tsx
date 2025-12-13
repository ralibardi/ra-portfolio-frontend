import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox, Input, RadioGroup, Select } from './index';

/**
 * Form components provide accessible, consistent form inputs with validation
 * and error handling support.
 *
 * ## Components
 * - **Input**: Text input with label, helper text, and error states
 * - **Select**: Dropdown with keyboard navigation
 * - **Checkbox**: Checkbox with indeterminate state support
 * - **RadioGroup**: Radio button group with exclusive selection
 */

// ============================================================================
// Input Stories
// ============================================================================

const inputMeta: Meta<typeof Input> = {
  title: 'Components/Form/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An accessible input field with label, placeholder, helper text, and error state support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'Input type',
      table: { defaultValue: { summary: 'text' } },
    },
    label: {
      control: 'text',
      description: 'Field label',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the field',
    },
    error: {
      control: 'text',
      description: 'Error message - displays error state when provided',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled',
      table: { defaultValue: { summary: 'false' } },
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
      table: { defaultValue: { summary: 'false' } },
    },
  },
};

export default inputMeta;
type InputStory = StoryObj<typeof inputMeta>;

/**
 * Basic input with label and placeholder.
 */
export const Default: InputStory = {
  render: function Render() {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: '300px' }}>
        <Input label="Email" placeholder="Enter your email" value={value} onChange={setValue} />
      </div>
    );
  },
};

/**
 * Input with helper text providing additional context.
 */
export const WithHelperText: InputStory = {
  render: function Render() {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: '300px' }}>
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          helperText="Must be at least 8 characters"
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

/**
 * Input in error state with error message.
 */
export const WithError: InputStory = {
  render: function Render() {
    const [value, setValue] = useState('invalid@');
    return (
      <div style={{ width: '300px' }}>
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          error="Please enter a valid email address"
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

/**
 * Required input with asterisk indicator.
 */
export const Required: InputStory = {
  render: function Render() {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: '300px' }}>
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          required
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

/**
 * Disabled input that cannot be interacted with.
 */
export const Disabled: InputStory = {
  render: function Render() {
    return (
      <div style={{ width: '300px' }}>
        <Input
          label="Username"
          placeholder="Enter username"
          value="john.doe"
          onChange={() => {
            // Intentionally empty - disabled input
          }}
          disabled
        />
      </div>
    );
  },
};

/**
 * All input states displayed together.
 */
export const AllStates: InputStory = {
  render: function Render() {
    const [values, setValues] = useState({
      default: '',
      helper: '',
      error: 'invalid',
      required: '',
      disabled: 'disabled value',
    });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '300px' }}>
        <Input
          label="Default"
          placeholder="Enter text"
          value={values.default}
          onChange={(v) => setValues((prev) => ({ ...prev, default: v }))}
        />
        <Input
          label="With Helper"
          placeholder="Enter text"
          helperText="This is helper text"
          value={values.helper}
          onChange={(v) => setValues((prev) => ({ ...prev, helper: v }))}
        />
        <Input
          label="With Error"
          placeholder="Enter text"
          error="This field has an error"
          value={values.error}
          onChange={(v) => setValues((prev) => ({ ...prev, error: v }))}
        />
        <Input
          label="Required"
          placeholder="Enter text"
          required
          value={values.required}
          onChange={(v) => setValues((prev) => ({ ...prev, required: v }))}
        />
        <Input
          label="Disabled"
          placeholder="Enter text"
          disabled
          value={values.disabled}
          onChange={(v) => setValues((prev) => ({ ...prev, disabled: v }))}
        />
      </div>
    );
  },
};

// ============================================================================
// Select Stories
// ============================================================================

const selectOptions = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany', disabled: true },
  { value: 'fr', label: 'France' },
];

/**
 * Basic select dropdown with options.
 */
export const SelectDefault: InputStory = {
  render: function Render() {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: '300px' }}>
        <Select
          label="Country"
          placeholder="Select a country"
          options={selectOptions}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
  name: 'Select - Default',
};

/**
 * Select with helper text.
 */
export const SelectWithHelper: InputStory = {
  render: function Render() {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: '300px' }}>
        <Select
          label="Country"
          placeholder="Select a country"
          helperText="Select your country of residence"
          options={selectOptions}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
  name: 'Select - With Helper',
};

/**
 * Select in error state.
 */
export const SelectWithError: InputStory = {
  render: function Render() {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: '300px' }}>
        <Select
          label="Country"
          placeholder="Select a country"
          error="Please select a country"
          options={selectOptions}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
  name: 'Select - With Error',
};

/**
 * Select with keyboard navigation.
 * Use Arrow keys to navigate, Enter to select, Escape to close.
 */
export const SelectKeyboardNav: InputStory = {
  render: function Render() {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: '300px' }}>
        <Select
          label="Country (Use keyboard)"
          placeholder="Focus and use arrow keys"
          helperText="↑↓ to navigate, Enter to select, Esc to close"
          options={selectOptions}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
  name: 'Select - Keyboard Navigation',
};

// ============================================================================
// Checkbox Stories
// ============================================================================

/**
 * Basic checkbox with label.
 */
export const CheckboxDefault: InputStory = {
  render: function Render() {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        label="I agree to the terms and conditions"
        checked={checked}
        onChange={setChecked}
      />
    );
  },
  name: 'Checkbox - Default',
};

/**
 * Checkbox in checked state.
 */
export const CheckboxChecked: InputStory = {
  render: function Render() {
    const [checked, setChecked] = useState(true);
    return <Checkbox label="Subscribe to newsletter" checked={checked} onChange={setChecked} />;
  },
  name: 'Checkbox - Checked',
};

/**
 * Checkbox in indeterminate state.
 * Used for "select all" scenarios where some items are selected.
 */
export const CheckboxIndeterminate: InputStory = {
  render: function Render() {
    const [items, setItems] = useState([true, false, true]);
    const allChecked = items.every(Boolean);
    const someChecked = items.some(Boolean);

    const handleSelectAll = () => {
      setItems(items.map(() => !allChecked));
    };

    const handleItemChange = (index: number) => {
      setItems(items.map((item, i) => (i === index ? !item : item)));
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Checkbox
          label="Select all items"
          checked={allChecked}
          indeterminate={someChecked && !allChecked}
          onChange={handleSelectAll}
        />
        <div
          style={{ marginLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
        >
          <Checkbox label="Item 1" checked={items[0]} onChange={() => handleItemChange(0)} />
          <Checkbox label="Item 2" checked={items[1]} onChange={() => handleItemChange(1)} />
          <Checkbox label="Item 3" checked={items[2]} onChange={() => handleItemChange(2)} />
        </div>
      </div>
    );
  },
  name: 'Checkbox - Indeterminate',
};

/**
 * Required checkbox with error state.
 */
export const CheckboxRequired: InputStory = {
  render: function Render() {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        label="I accept the privacy policy"
        checked={checked}
        onChange={setChecked}
        required
        error={!checked ? 'You must accept the privacy policy' : undefined}
      />
    );
  },
  name: 'Checkbox - Required',
};

/**
 * Disabled checkbox.
 */
export const CheckboxDisabled: InputStory = {
  render: function Render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Checkbox
          label="Disabled unchecked"
          checked={false}
          onChange={() => {
            // Intentionally empty - disabled checkbox
          }}
          disabled
        />
        <Checkbox
          label="Disabled checked"
          checked={true}
          onChange={() => {
            // Intentionally empty - disabled checkbox
          }}
          disabled
        />
      </div>
    );
  },
  name: 'Checkbox - Disabled',
};

// ============================================================================
// RadioGroup Stories
// ============================================================================

const radioOptions = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

/**
 * Basic radio group with vertical layout.
 */
export const RadioGroupDefault: InputStory = {
  render: function Render() {
    const [value, setValue] = useState('medium');
    return (
      <RadioGroup
        label="Size"
        name="size"
        options={radioOptions}
        value={value}
        onChange={setValue}
      />
    );
  },
  name: 'RadioGroup - Default',
};

/**
 * Radio group with horizontal layout.
 */
export const RadioGroupHorizontal: InputStory = {
  render: function Render() {
    const [value, setValue] = useState('medium');
    return (
      <RadioGroup
        label="Size"
        name="size-horizontal"
        options={radioOptions}
        value={value}
        onChange={setValue}
        orientation="horizontal"
      />
    );
  },
  name: 'RadioGroup - Horizontal',
};

/**
 * Required radio group with error state.
 */
export const RadioGroupRequired: InputStory = {
  render: function Render() {
    const [value, setValue] = useState('');
    return (
      <RadioGroup
        label="Select a size"
        name="size-required"
        options={radioOptions}
        value={value}
        onChange={setValue}
        required
        error={!value ? 'Please select a size' : undefined}
      />
    );
  },
  name: 'RadioGroup - Required',
};

/**
 * Radio group with disabled options.
 */
export const RadioGroupWithDisabled: InputStory = {
  render: function Render() {
    const [value, setValue] = useState('medium');
    const optionsWithDisabled = [
      { value: 'small', label: 'Small' },
      { value: 'medium', label: 'Medium' },
      { value: 'large', label: 'Large (Out of stock)', disabled: true },
    ];
    return (
      <RadioGroup
        label="Size"
        name="size-disabled"
        options={optionsWithDisabled}
        value={value}
        onChange={setValue}
      />
    );
  },
  name: 'RadioGroup - With Disabled Option',
};

// ============================================================================
// Complete Form Example
// ============================================================================

/**
 * Complete form example showing all components working together.
 */
export const CompleteForm: InputStory = {
  render: function Render() {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      country: '',
      size: 'medium',
      newsletter: false,
      terms: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors: Record<string, string> = {};

      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.country) newErrors.country = 'Please select a country';
      if (!formData.terms) newErrors.terms = 'You must accept the terms';

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        alert('Form submitted successfully!');
      }
    };

    return (
      <form
        onSubmit={handleSubmit}
        style={{ width: '350px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
      >
        <Input
          label="Full Name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={(v) => setFormData((prev) => ({ ...prev, name: v }))}
          required
          error={errors.name}
        />
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(v) => setFormData((prev) => ({ ...prev, email: v }))}
          required
          error={errors.email}
        />
        <Select
          label="Country"
          placeholder="Select a country"
          options={selectOptions}
          value={formData.country}
          onChange={(v) => setFormData((prev) => ({ ...prev, country: v }))}
          required
          error={errors.country}
        />
        <RadioGroup
          label="Preferred Size"
          name="form-size"
          options={radioOptions}
          value={formData.size}
          onChange={(v) => setFormData((prev) => ({ ...prev, size: v }))}
        />
        <Checkbox
          label="Subscribe to newsletter"
          checked={formData.newsletter}
          onChange={(v) => setFormData((prev) => ({ ...prev, newsletter: v }))}
        />
        <Checkbox
          label="I accept the terms and conditions"
          checked={formData.terms}
          onChange={(v) => setFormData((prev) => ({ ...prev, terms: v }))}
          required
          error={errors.terms}
        />
        <button type="submit" style={{ padding: '0.75rem 1.5rem', cursor: 'pointer' }}>
          Submit
        </button>
      </form>
    );
  },
  name: 'Complete Form Example',
};
