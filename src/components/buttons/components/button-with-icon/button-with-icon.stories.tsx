import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import ButtonWithIcon from './button-with-icon';

const meta: Meta<typeof ButtonWithIcon> = {
  title: 'Buttons/ButtonWithIcon',
  component: ButtonWithIcon,
  argTypes: {
    icon: { control: 'object' },
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
  render: (args) => <ButtonWithIcon {...args} />,
};

export const DefaultState: Story = {
  ...Template,
  args: {
    icon: faArrowLeft,
    label: 'Testing',
    size: 'medium',
  },
};

export const Small: Story = {
  ...Template,
  args: {
    icon: faArrowLeft,
    label: 'Small',
    size: 'small',
  },
};

export const Large: Story = {
  ...Template,
  args: {
    icon: faArrowLeft,
    label: 'Large',
    size: 'large',
  },
};

export const OnClick: Story = {
  ...Template,
  args: {
    ...DefaultState.args,
    onClick: () => {
      // Storybook action placeholder
    },
  },
};

export const LoadingState: Story = {
  ...Template,
  args: {
    ...DefaultState.args,
    isLoading: true,
    label: 'Loading',
  },
};

export const Disabled: Story = {
  ...Template,
  args: {
    ...DefaultState.args,
    disabled: true,
    label: 'Disabled',
  },
};
