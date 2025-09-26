import { PrimaryButton, SecondaryButton } from '@components/buttons';
import Divider from '@components/divider';
import TextArea from '@components/text-area';
import TextInput from '@components/text-input';
import { useToast } from '@contexts/toast-context';
import type React from 'react';
import { type FunctionComponent, lazy, Suspense, useCallback, useState } from 'react';
import styles from '../assets/contact-page.module.scss';

const Loading = lazy(() => import('@components/loading'));

const ContactPage: FunctionComponent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { success } = useToast();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      try {
        // Placeholder for future API integration
        await new Promise((r) => setTimeout(r, 500));
        setName('');
        setEmail('');
        setMessage('');
        success('Thanks! Your message has been sent.');
      } finally {
        setSubmitting(false);
      }
    },
    [success],
  );

  const handleReset = useCallback(() => {
    setName('');
    setEmail('');
    setMessage('');
  }, []);

  return (
    <div className={styles.container}>
      <Suspense fallback={<Loading />}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.grid}>
            <TextInput
              label="Name"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
            <TextInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <div className={styles.fullRow}>
              <Divider label="Message" />
            </div>
            <div className={styles.fullRow}>
              <TextArea
                label="Message"
                placeholder="How can I help you?"
                value={message}
                onChange={(e) => setMessage(e.currentTarget.value)}
                rows={6}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <SecondaryButton
              type="button"
              label="Reset"
              onClick={handleReset}
              disabled={submitting}
            />
            <PrimaryButton type="submit" label="Send" isLoading={submitting} />
          </div>
        </form>
      </Suspense>
    </div>
  );
};

export default ContactPage;
