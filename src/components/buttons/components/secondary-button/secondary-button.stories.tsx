import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SecondaryButton from './secondary-button';

const meta: Meta<typeof SecondaryButton> = {
  title: 'Buttons/SecondaryButton',
  component: SecondaryButton,
  argTypes: {
    label: { control: 'text' },
    isLoading: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = {
  render: (args) => <SecondaryButton {...args} />,
};

export const Default = {
  ...Template,
  args: {
    label: 'Default',
  },
};

export const WithOnClick = {
  ...Template,
  args: {
    ...Default.args,
    onClick: () => {},
  },
};

export const Loading = {
  ...Template,
  args: {
    ...Default.args,
    isLoading: true,
    label: 'Loading',
  },
};
