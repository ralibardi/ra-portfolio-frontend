import type { Meta, StoryObj } from '@storybook/react-vite';
import TextInput from './text-input';

const meta: Meta<typeof TextInput> = {
  title: 'Form/TextInput',
  component: TextInput,
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    helperText: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <TextInput {...args} />,
  args: {
    label: 'Label',
    placeholder: 'Type here...',
  },
};

export const WithError: Story = {
  render: (args) => <TextInput {...args} />,
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    error: 'Invalid email',
  },
};

export const WithHelper: Story = {
  render: (args) => <TextInput {...args} />,
  args: {
    label: 'Name',
    helperText: 'We will not spam you',
  },
};
