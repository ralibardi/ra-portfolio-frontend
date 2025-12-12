import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ISocialLink } from '../../utils/getSocialLinks';
import FooterSocials from './footer-socials';

const meta: Meta<typeof FooterSocials> = {
  title: 'Links/FooterSocials',
  component: FooterSocials,
  argTypes: {
    socialLinks: { control: 'object' },
  },
};

export default meta;

type Story = StoryObj<typeof FooterSocials>;

const baseSocialLink: ISocialLink = {
  icon: faGoogle,
  link: 'https://www.google.com',
  order: 0,
  isHidden: false,
};

export const DefaultState: Story = {
  args: {
    socialLinks: [baseSocialLink],
  },
};

export const IsLinkHidden: Story = {
  args: {
    socialLinks: [{ ...baseSocialLink, isHidden: true }],
  },
};
