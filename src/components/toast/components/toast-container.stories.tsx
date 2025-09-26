import { ToastProvider, useToast } from '@contexts/toast-context';
import type { Meta, StoryObj } from '@storybook/react';
import type React from 'react';
import ToastContainer from './toast-container';

const meta: Meta<typeof ToastContainer> = {
  title: 'Feedback/ToastContainer',
  component: ToastContainer,
};

export default meta;

type Story = StoryObj<typeof meta>;

const DemoButtons: React.FC = () => {
  const { success, error, info } = useToast();
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <button onClick={() => success('Saved!')}>Success</button>
      <button onClick={() => error('Something went wrong')}>Error</button>
      <button onClick={() => info('Heads up!')}>Info</button>
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
