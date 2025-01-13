import type { Meta, StoryObj } from '@storybook/react';
import ButtonWithIcon from './button-with-icon';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const meta: Meta<typeof ButtonWithIcon> = {
  title: 'Buttons/ButtonWithIcon',
  component: ButtonWithIcon,
  argTypes: {
    icon: { control: 'object' },
    label: { control: 'text' },
    isLoading: { control: 'boolean' },
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
  },
};

export const OnClick: Story = {
  ...Template,
  args: {
    ...DefaultState.args,
    onClick: () => {},
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
