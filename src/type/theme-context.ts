import { Theme } from './theme';

export interface IThemeContext {
  readonly theme: Theme;
  readonly effectiveTheme: 'light' | 'dark';
  readonly toggleTheme: () => void;
  readonly setTheme: (theme: Theme) => void;
}
