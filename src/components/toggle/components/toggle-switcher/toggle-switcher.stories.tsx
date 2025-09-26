import type { Meta, StoryObj } from '@storybook/react';
import ToggleSwitcher from './toggle-switcher';

const meta: Meta<typeof ToggleSwitcher> = {
  title: 'Toggles/ToggleSwitcher',
  component: ToggleSwitcher,
  argTypes: {
    onChange: { action: 'changed' },
  },
};

export default meta;

type Story = StoryObj<typeof ToggleSwitcher>;

const Template: Story = {
  render: (args) => <ToggleSwitcher {...args} />,
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

export const InvertedLogic: Story = {
  ...Template,
  args: {
    checked: false,
    invertedIconLogic: true,
  },
};

export const InvertedLogicChecked: Story = {
  ...Template,
  args: {
    checked: true,
    invertedIconLogic: true,
  },
};
