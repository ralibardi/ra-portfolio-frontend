import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import type { Meta, StoryObj } from '@storybook/react';
import IconLink from './icon-link';

const meta: Meta<typeof IconLink> = {
  title: 'Links/IconLink',
  component: IconLink,
  argTypes: {
    icon: { control: 'object' },
    title: { control: 'text' },
    linkUrl: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof IconLink>;

const Template: Story = {
  render: (args) => <IconLink {...args} />,
};

export const Default: Story = {
  ...Template,
  args: {
    icon: faArrowLeft,
    title: 'Testing',
    linkUrl: 'https://example.com',
  },
};

export const NoTitle: Story = {
  ...Template,
  args: {
    icon: faArrowLeft,
    linkUrl: 'https://example.com',
  },
};

export const NoIcon: Story = {
  ...Template,
  args: {
    title: 'Testing',
    linkUrl: 'https://example.com',
  },
};
