'use client';

import { ToggleSwitcher } from '@components/toggle';
import { useTheme } from '@hooks/use-theme';
import React from 'react';
import styles from '../assets/theme-toggle.module.scss';

const ThemeToggle: React.FC = () => {
  const themeContext = useTheme();

  if (!themeContext || 'message' in themeContext) {
    return null;
  }

  const { theme, effectiveTheme, toggleTheme } = themeContext;

  // Show the effective theme state, but cycle through all options on toggle
  return (
    <div
      className={styles.container}
      title={`Current theme: ${theme}${theme === 'system' ? ` (${effectiveTheme})` : ''}`}
      data-testid="theme-toggle"
    >
      <div className={styles.wrapper}>
        <ToggleSwitcher checked={effectiveTheme === 'dark'} onChange={toggleTheme} />
      </div>
    </div>
  );
};

export default React.memo(ThemeToggle);
