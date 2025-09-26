import { ToggleSwitcher } from '@components/toggle';
import { useTheme } from '@hooks/use-theme';
import React from 'react';

const ThemeToggle: React.FC = () => {
  const themeContext = useTheme();

  if (!themeContext || 'message' in themeContext) {
    return null;
  }

  const { theme, effectiveTheme, toggleTheme } = themeContext;

  // Show the effective theme state, but cycle through all options on toggle
  return (
    <div title={`Current theme: ${theme}${theme === 'system' ? ` (${effectiveTheme})` : ''}`}>
      <ToggleSwitcher checked={effectiveTheme === 'dark'} onChange={toggleTheme} />
    </div>
  );
};

export default React.memo(ThemeToggle);
