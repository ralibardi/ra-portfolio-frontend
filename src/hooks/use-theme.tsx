'use client';

import ThemeContext from '@contexts/theme-context';
import { useContext } from 'react';

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === null || context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
