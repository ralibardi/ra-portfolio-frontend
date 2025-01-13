import { Theme } from './theme';

export interface IThemeContext {
  readonly theme: Theme;
  readonly toggleTheme: () => void;
}
