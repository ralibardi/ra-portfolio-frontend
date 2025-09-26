import { faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import type { Meta, StoryObj } from '@storybook/react';
import type IRoute from '@type/route';
import NavLink from './nav-link';

const meta: Meta<typeof NavLink> = {
  title: 'Links/NavLink',
  component: NavLink,
  argTypes: {
    route: {
      control: 'object',
      description: 'Route object containing path, labelKey, icon, etc.',
    },
    isActive: {
      control: 'boolean',
      description: 'Whether the link is currently active',
    },
  },
};

export default meta;

type Story = StoryObj<typeof NavLink>;

const baseRoute: IRoute = {
  path: '/home',
  labelKey: 'Home',
  icon: faHome,
  index: false,
  component: () => <></>,
};

const Template: Story = {
  render: (args) => <NavLink {...args} />,
};

export const Default: Story = {
  ...Template,
  args: {
    route: baseRoute,
    isActive: false,
  },
};

export const Active: Story = {
  ...Template,
  args: {
    ...Default.args,
    isActive: true,
  },
};

export const DifferentIcon: Story = {
  ...Template,
  args: {
    route: {
      ...baseRoute,
      path: '/profile',
      labelKey: 'Profile',
      icon: faUser,
    },
    isActive: false,
  },
};

export const LongLabel: Story = {
  ...Template,
  args: {
    route: { ...baseRoute, labelKey: 'Very Long Label Text' },
    isActive: false,
  },
};
