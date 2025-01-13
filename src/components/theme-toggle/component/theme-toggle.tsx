import React from 'react';
import { useTheme } from '@hooks/use-theme';
import { ToggleSwitcher } from '@components/toggle';

const ThemeToggle: React.FC = () => {
  const themeContext = useTheme();

  if (!themeContext || 'message' in themeContext) {
    return null;
  }

  const { theme, toggleTheme } = themeContext;

  return <ToggleSwitcher checked={theme === 'dark'} onChange={toggleTheme} />;
};

export default React.memo(ThemeToggle);
