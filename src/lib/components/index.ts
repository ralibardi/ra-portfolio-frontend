/**
 * Component Library
 *
 * This module exports all reusable UI components from the component library.
 * Components are organized by category and follow consistent patterns for
 * accessibility, theming, and testing.
 *
 * Tree-shaking optimized: Import only what you need!
 *
 * @example
 * ```tsx
 * // Tree-shakeable imports (recommended)
 * import { Button, Input, Modal } from '@lib/components';
 *
 * // Category-specific imports (also tree-shakeable)
 * import { Button } from '@lib/components/Button';
 * import { Input, Select } from '@lib/components/Form';
 * ```
 *
 * @module lib/components
 */

// Layout Components
export * from './Accordion';
// Overlay Components
export * from './Alert';
export * from './Breadcrumb';
// Foundation Components
export * from './Button';
// Form Components
export * from './Form';
// Loading Components
export * from './Loading';
export * from './Modal';
export * from './Pagination';
export * from './Tabs';
export * from './Tooltip';

// Types (always include for TypeScript support)
export * from './types';

// Utilities (helpful functions and constants)
export * from './utils';
