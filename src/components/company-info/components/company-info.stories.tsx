import type { Meta, StoryObj } from '@storybook/react';
import CompanyInfo from './company-info';

const meta: Meta<typeof CompanyInfo> = {
  title: 'Components/CompanyInfo',
  component: CompanyInfo,
  argTypes: {
    isLabelHidden: {
      control: 'boolean',
      description: 'Whether to hide the company label',
    },
  },
};

export default meta;

type Story = StoryObj<typeof CompanyInfo>;

export const Default: Story = {
  args: {},
};

export const HiddenLabel: Story = {
  args: {
    isLabelHidden: true,
  },
};
