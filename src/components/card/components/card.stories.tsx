import type { Meta, StoryObj } from '@storybook/react-vite';
import Card from './card';

/**
 * Card Component Stories for Visual Regression Testing with Chromatic
 *
 * These stories provide comprehensive visual coverage for the Card component
 * across all variants, states, and theme combinations.
 *
 * **Feature: 7-1-css-modules-implementation, Property 6: Visual Regression Preservation**
 * **Validates: Requirements 4.3**
 */
const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    chromatic: {
      viewports: [320, 768, 1200],
      diffThreshold: 0.01,
    },
  },
  argTypes: {
    elevated: {
      control: 'boolean',
      description: 'Applies elevated shadow styling',
    },
    interactive: {
      control: 'boolean',
      description: 'Enables hover and focus states',
    },
    as: {
      control: 'select',
      options: ['article', 'div', 'section', 'aside'],
      description: 'HTML element to render as',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// Base story - default card
export const Default: Story = {
  args: {
    children:
      'This is the default card content. It uses design tokens for spacing and theme-aware colors.',
  },
};

// Elevated variant
export const Elevated: Story = {
  args: {
    children: 'This card has elevated styling with a stronger shadow.',
    elevated: true,
  },
};

// Interactive variant
export const Interactive: Story = {
  args: {
    children: 'This card is interactive. Hover over it to see the effect.',
    interactive: true,
  },
  parameters: {
    chromatic: {
      delay: 300,
    },
  },
};

// Elevated + Interactive
export const ElevatedInteractive: Story = {
  args: {
    children: 'This card combines elevated and interactive styles.',
    elevated: true,
    interactive: true,
  },
};

// Different semantic elements
export const AsDiv: Story = {
  args: {
    as: 'div',
    children: 'This card renders as a <div> element.',
  },
};

export const AsSection: Story = {
  args: {
    as: 'section',
    children: 'This card renders as a <section> element.',
  },
};

// With custom className (utility classes)
export const WithUtilityClasses: Story = {
  args: {
    className: 'p-lg m-md',
    children: 'This card has additional utility classes applied.',
  },
};

// Long content
export const LongContent: Story = {
  args: {
    children:
      'This card contains longer content to demonstrate how the card handles text wrapping and maintains proper spacing. The design tokens ensure consistent padding and the theme-aware colors adapt to light and dark modes automatically.',
    elevated: true,
  },
};
