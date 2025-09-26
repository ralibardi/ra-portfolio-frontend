import type { Meta, StoryObj } from '@storybook/react';
import ToggleWithLabel from './toggle-with-label';

const meta: Meta<typeof ToggleWithLabel> = {
  title: 'Toggles/ToggleWithLabel',
  component: ToggleWithLabel,
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof ToggleWithLabel>;

const commonArgs = {
  label: 'Testing',
};

export const DefaultState: Story = {
  args: {
    ...commonArgs,
  },
};

export const Checked: Story = {
  args: {
    ...commonArgs,
    checked: true,
  },
};
