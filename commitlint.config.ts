import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['Feat', 'Fix', 'Docs', 'Style', 'Refactor', 'Test', 'Chore'],
    ],
    'type-case': [2, 'always', 'sentence-case'],
    'scope-case': [2, 'always', 'sentence-case'],
    'subject-case': [2, 'always', 'sentence-case'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 500],
    'footer-max-line-length': [2, 'always', 100],
    'header-min-length': [2, 'always', 20],
  },
  ignores: [(commitMessage: string) => commitMessage.startsWith('WIP')],
};

export default config;
