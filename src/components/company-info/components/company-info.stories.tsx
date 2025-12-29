import type { Meta, StoryObj } from '@storybook/react-vite';
import CompanyInfo from './company-info';

const meta: Meta<typeof CompanyInfo> = {
  title: 'Components/CompanyInfo',
  component: CompanyInfo,
  argTypes: {
    label: {
      control: 'text',
      description: 'Company label text',
    },
    isLabelHidden: {
      control: 'boolean',
      description: 'Whether to hide the company label',
    },
  },
};

export default meta;

type Story = StoryObj<typeof CompanyInfo>;

export const Default: Story = {
  args: {
    label: 'Ronny Alibardi',
  },
};

export const HiddenLabel: Story = {
  args: {
    label: 'Ronny Alibardi',
    isLabelHidden: true,
  },
};
