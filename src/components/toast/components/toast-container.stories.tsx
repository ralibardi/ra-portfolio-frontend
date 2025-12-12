import { ToastProvider, useToast } from '@contexts/toast-context';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type React from 'react';
import ToastContainer from './toast-container';

const meta: Meta<typeof ToastContainer> = {
  title: 'Feedback/ToastContainer',
  component: ToastContainer,
};

export default meta;

type Story = StoryObj<typeof meta>;

const DemoButtons: React.FC = () => {
  const { success, error, info, warning } = useToast();
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <button type="button" onClick={() => success('Saved!')}>
        Success
      </button>
      <button type="button" onClick={() => warning('Please review')}>
        Warning
      </button>
      <button type="button" onClick={() => error('Something went wrong')}>
        Error
      </button>
      <button type="button" onClick={() => info('Heads up!')}>
        Info
      </button>
    </div>
  );
};

export const Playground: Story = {
  render: () => (
    <ToastProvider>
      <DemoButtons />
      <ToastContainer />
    </ToastProvider>
  ),
};
