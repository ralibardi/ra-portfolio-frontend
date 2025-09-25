import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Divider from './divider';

const meta: Meta<typeof Divider> = {
  title: 'Layout/Divider',
  component: Divider,
  argTypes: {
    label: { control: 'text' },
    orientation: {
      control: { type: 'radio' },
      options: ['horizontal', 'vertical'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => <Divider {...args} />,
  args: {
    label: 'OR',
    orientation: 'horizontal',
  },
};

export const Vertical: Story = {
  render: (args) => (
    <div
      style={{ display: 'flex', gap: 16, alignItems: 'stretch', height: 64 }}
    >
      <div>Left</div>
      <Divider {...args} />
      <div>Right</div>
    </div>
  ),
  args: {
    orientation: 'vertical',
  },
};
