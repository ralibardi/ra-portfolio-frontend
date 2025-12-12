import type { Meta, StoryObj } from '@storybook/react-vite';
import SecondaryButton from './secondary-button';

const meta: Meta<typeof SecondaryButton> = {
  title: 'Buttons/SecondaryButton',
  component: SecondaryButton,
  argTypes: {
    label: { control: 'text' },
    isLoading: { control: 'boolean' },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    disabled: { control: 'boolean' },
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
    size: 'medium',
  },
};

export const Small = {
  ...Template,
  args: {
    label: 'Small',
    size: 'small',
  },
};

export const Large = {
  ...Template,
  args: {
    label: 'Large',
    size: 'large',
  },
};

export const WithOnClick = {
  ...Template,
  args: {
    ...Default.args,
    onClick: () => {
      // Storybook action placeholder
    },
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

export const Disabled = {
  ...Template,
  args: {
    ...Default.args,
    disabled: true,
    label: 'Disabled',
  },
};
