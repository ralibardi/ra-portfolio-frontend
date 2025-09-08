# Project Structure

## Root Directory Organization

```
ra-portfolio/
├── .github/          # GitHub Actions workflows
├── .husky/           # Git hooks configuration
├── .kiro/            # Kiro AI assistant configuration
├── .storybook/       # Storybook configuration
├── public/           # Static assets and PWA files
├── src/              # Source code
└── dist/             # Build output (generated)
```

## Source Code Structure (`src/`)

### Core Application
- `main.tsx` - Application entry point with providers setup
- `global.d.ts` - Global TypeScript declarations
- `vite-env.d.ts` - Vite environment types

### Feature Organization
```
src/
├── app/              # Application core and routing
│   ├── i18n/         # Internationalization setup
│   └── routes/       # Route definitions
├── pages/            # Page components (route handlers)
├── components/       # Reusable UI components
├── contexts/         # React context providers
├── hooks/            # Custom React hooks
├── api/              # API client and service layer
├── utils/            # Utility functions and helpers
├── type/             # TypeScript type definitions
└── assets/           # Styles and static assets
```

## Import Path Conventions

Use TypeScript path mapping for clean imports:

- `@/` - Root src directory
- `@app/` - Application core
- `@components/` - UI components
- `@pages/` - Page components
- `@hooks/` - Custom hooks
- `@contexts/` - React contexts
- `@api/` - API services
- `@utils/` - Utilities
- `@type/` - Type definitions
- `@assets/` - Styles and assets
- `@public/` - Public directory

## Component Organization

### Component Structure
Each component should have its own directory with:
- `ComponentName.tsx` - Main component file
- `ComponentName.test.tsx` - Unit tests
- `ComponentName.stories.tsx` - Storybook stories
- `ComponentName.module.scss` - Component styles (if needed)

### Page Structure
Pages are organized by feature/route:
- `PageName/` directory containing the page component
- Follow same testing and styling patterns as components

## File Naming Conventions

- **Components**: PascalCase (e.g., `ThemeToggle.tsx`)
- **Pages**: kebab-case directories with PascalCase files (e.g., `about-page/AboutPage.tsx`)
- **Hooks**: camelCase starting with "use" (e.g., `useTheme.tsx`)
- **Utilities**: kebab-case (e.g., `route-paths.ts`)
- **Types**: kebab-case (e.g., `theme-context.ts`)
- **Styles**: kebab-case with appropriate extension (e.g., `_variables.scss`)

## Testing Organization

- Tests are co-located with source files using `.test.tsx` suffix
- Test utilities in `src/utils/test-utilities.tsx`
- Coverage threshold: 80% for functions, lines, and statements
- Snapshot tests stored in `__snapshots__/` directories

## Asset Organization

### Styles (`src/assets/`)
- `index.scss` - Main stylesheet entry point
- `global.scss` - Global styles
- `_variables.scss` - SCSS variables
- `_mixins.scss` - SCSS mixins
- `_breakpoints.scss` - Responsive breakpoints
- `_colours.scss` - Color palette
- `_fonts.scss` - Typography definitions
- `_animations.scss` - Animation definitions

### Public Assets (`public/`)
- `icons/` - App icons for PWA
- `locales/` - Translation files
- `screenshots/` - App screenshots
- `splashscreens/` - PWA splash screens