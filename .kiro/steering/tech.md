# Technology Stack

## Core Technologies

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 5.4.6
- **Package Manager**: pnpm (required >=9.15.2)
- **Node.js**: >=18.0.0

## Key Libraries & Dependencies

- **Routing**: React Router DOM 7.5.0
- **State Management**: @tanstack/react-query for server state
- **Styling**: SCSS with CSS Modules
- **Animations**: Framer Motion
- **Icons**: FontAwesome React components
- **Internationalization**: i18next with react-i18next
- **PWA**: Workbox for service worker functionality
- **Error Handling**: React Error Boundary

## Development Tools

- **Testing**: Jest + React Testing Library + @testing-library/jest-dom
- **UI Development**: Storybook 8.4.7
- **Linting & Formatting**: Biome with TypeScript, React, and accessibility rules
- **Git Hooks**: Husky with lint-staged
- **Commit Linting**: Commitlint with conventional commits

## Common Commands

### Development

```bash
pnpm run dev          # Start development server
pnpm run build:dev    # Build for development
pnpm run watch        # Build with watch mode
```

### Testing

```bash
pnpm run test         # Run tests with updates
pnpm run test:coverage # Run tests with coverage report
pnpm run test:watch   # Run tests in watch mode
```

### Code Quality

```bash
pnpm run lint         # Run Biome linting
pnpm run lint:fix     # Run Biome with auto-fix
pnpm run format       # Format code with Biome
```

### Storybook

```bash
pnpm run storybook    # Start Storybook dev server
pnpm run build-storybook # Build Storybook
```

### Production

```bash
pnpm run build       # Build for production
pnpm run preview     # Preview production build
```

### Maintenance

```bash
pnpm run clean       # Remove dist folder
pnpm run clean:all   # Remove dist and node_modules
```

## Build Configuration

- **Vite Config**: Custom configuration with React plugin, TypeScript paths, and SCSS preprocessing
- **TypeScript**: Strict mode enabled with path mapping for clean imports
- **SCSS**: Modern compiler API with CSS Modules support
- **Asset Handling**: Optimized bundling with chunking strategy for production
