import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import type { Meta, StoryObj } from '@storybook/react';
import ToggleWithIcons from './toggle-with-icons';

const meta: Meta<typeof ToggleWithIcons> = {
  title: 'Toggles/ToggleWithIcons',
  component: ToggleWithIcons,
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof ToggleWithIcons>;

export const DefaultState: Story = {
  args: {
    iconLeft: faArrowLeft,
    iconRight: faArrowRight,
  },
};

export const Checked: Story = {
  args: {
    ...DefaultState.args,
    checked: true,
  },
};
