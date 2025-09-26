import type { Meta, StoryObj } from '@storybook/react';
import Toggle from './toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Toggles/Toggle',
  component: Toggle,
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof Toggle>;

const Template: Story = {
  render: (args) => <Toggle {...args} />,
};

export const DefaultState: Story = {
  ...Template,
  args: {},
};

export const Checked: Story = {
  ...Template,
  args: {
    checked: true,
  },
};
