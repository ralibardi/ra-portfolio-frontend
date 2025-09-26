import type { Meta, StoryObj } from '@storybook/react';
import TextArea from './text-area';

const meta: Meta<typeof TextArea> = {
  title: 'Form/TextArea',
  component: TextArea,
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    helperText: { control: 'text' },
    rows: { control: { type: 'number', min: 2, max: 12 } },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <TextArea {...args} />,
  args: {
    label: 'Message',
    placeholder: 'Type your message...',
  },
};

export const WithError: Story = {
  render: (args) => <TextArea {...args} />,
  args: {
    label: 'Message',
    error: 'Too short',
  },
};

export const WithHelper: Story = {
  render: (args) => <TextArea {...args} />,
  args: {
    label: 'Message',
    helperText: 'Max 500 characters',
    rows: 6,
  },
};
