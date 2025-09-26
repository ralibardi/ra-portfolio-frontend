import type { Meta, StoryObj } from '@storybook/react';
import Loading from './loading';

const meta: Meta<typeof Loading> = {
  title: 'Components/Loading',
  component: Loading,
  argTypes: {
    size: {
      control: 'select',
      options: ['auto', 'small', 'medium', 'large'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Loading>;

const Template: Story = {
  render: (args) => <Loading {...args} />,
};

export const Default: Story = {
  ...Template,
};

export const Sizes: Story = {
  ...Template,
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Loading size="auto" />
      <Loading size="small" />
      <Loading size="medium" />
      <Loading size="large" />
    </div>
  ),
};
