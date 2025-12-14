import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { AccordionItem } from '../types';
import { Accordion } from './index';

/**
 * The Accordion component allows users to expand and collapse content sections.
 * It supports single or multiple expansion modes, keyboard navigation, and
 * smooth animations following WAI-ARIA accordion patterns.
 *
 * ## Features
 * - **Single/Multiple Expansion**: Control whether one or multiple sections can be open
 * - **Keyboard Navigation**: Arrow keys, Home, and End for navigation
 * - **Smooth Animations**: CSS-based height animations with reduced motion support
 * - **Accessibility**: Full ARIA support with proper roles and states
 * - **Disabled Items**: Individual items can be disabled
 * - **Default State**: Configure initially expanded sections
 *
 * ## Usage Examples
 * ```tsx
 * // Basic accordion
 * <Accordion
 *   items={[
 *     {
 *       id: '1',
 *       header: 'Section 1',
 *       content: <p>Content for section 1</p>
 *     },
 *     {
 *       id: '2',
 *       header: 'Section 2',
 *       content: <p>Content for section 2</p>
 *     }
 *   ]}
 * />
 *
 * // Multiple expansion allowed
 * <Accordion
 *   items={items}
 *   allowMultiple={true}
 *   defaultExpanded={['1', '3']}
 * />
 * ```
 *
 * ## Keyboard Navigation
 * - **Tab**: Moves focus to next accordion header
 * - **Shift+Tab**: Moves focus to previous accordion header
 * - **Space/Enter**: Toggles expansion of focused section
 * - **Arrow Down**: Moves focus to next accordion header
 * - **Arrow Up**: Moves focus to previous accordion header
 * - **Home**: Moves focus to first accordion header
 * - **End**: Moves focus to last accordion header
 *
 * ## Accessibility Features
 * - Proper heading structure with `<h3>` elements
 * - `aria-expanded` indicates section state
 * - `aria-controls` links headers to content panels
 * - `aria-disabled` for disabled sections
 * - Focus indicators that meet WCAG standards
 * - Respects `prefers-reduced-motion` for animations
 * - Screen reader announcements for state changes
 */
const meta: Meta<typeof Accordion> = {
  title: 'Layout/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A collapsible content component that allows users to expand and collapse sections with smooth animations and full keyboard support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      description: 'Array of accordion items with id, header, content, and optional disabled state',
      table: {
        type: { summary: 'AccordionItem[]' },
      },
    },
    allowMultiple: {
      control: 'boolean',
      description: 'Whether multiple sections can be expanded simultaneously',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    defaultExpanded: {
      control: 'object',
      description: 'Array of item IDs that should be expanded on initial render',
      table: {
        defaultValue: { summary: '[]' },
      },
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when expansion state changes',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label for the accordion',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '500px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample accordion items
const sampleItems: AccordionItem[] = [
  {
    id: '1',
    header: 'What is React?',
    content: (
      <p>
        React is a JavaScript library for building user interfaces. It lets you compose complex UIs
        from small and isolated pieces of code called "components".
      </p>
    ),
  },
  {
    id: '2',
    header: 'What is TypeScript?',
    content: (
      <p>
        TypeScript is a strongly typed programming language that builds on JavaScript, giving you
        better tooling at any scale. It adds optional static typing and class-based object-oriented
        programming to the language.
      </p>
    ),
  },
  {
    id: '3',
    header: 'What is Storybook?',
    content: (
      <p>
        Storybook is a frontend workshop for building UI components and pages in isolation. It helps
        you develop and share hard-to-reach states and edge cases without needing to run your whole
        app.
      </p>
    ),
  },
];

// ============================================================================
// Basic Stories
// ============================================================================

/**
 * The default accordion with single expansion mode.
 * Only one section can be expanded at a time.
 */
export const Default: Story = {
  args: {
    items: sampleItems,
    'aria-label': 'FAQ Accordion',
  },
};

/**
 * Accordion with multiple expansion mode enabled.
 * Multiple sections can be expanded simultaneously.
 */
export const MultipleExpansion: Story = {
  args: {
    items: sampleItems,
    allowMultiple: true,
    'aria-label': 'FAQ Accordion',
  },
  parameters: {
    docs: {
      description: {
        story: 'With `allowMultiple={true}`, users can expand multiple sections at the same time.',
      },
    },
  },
};

/**
 * Accordion with sections expanded by default.
 */
export const DefaultExpanded: Story = {
  args: {
    items: sampleItems,
    defaultExpanded: ['1'],
    'aria-label': 'FAQ Accordion',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use `defaultExpanded` to specify which sections should be open on initial render.',
      },
    },
  },
};

/**
 * Multiple sections expanded by default (requires allowMultiple).
 */
export const MultipleDefaultExpanded: Story = {
  args: {
    items: sampleItems,
    defaultExpanded: ['1', '2'],
    allowMultiple: true,
    'aria-label': 'FAQ Accordion',
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple sections can be expanded by default when `allowMultiple` is enabled.',
      },
    },
  },
};

// ============================================================================
// Disabled Items
// ============================================================================

const itemsWithDisabled: AccordionItem[] = [
  {
    id: '1',
    header: 'Available Section',
    content: <p>This section can be expanded and collapsed normally.</p>,
  },
  {
    id: '2',
    header: 'Disabled Section',
    content: <p>This content is not accessible because the section is disabled.</p>,
    disabled: true,
  },
  {
    id: '3',
    header: 'Another Available Section',
    content: <p>This section is also available for interaction.</p>,
  },
];

/**
 * Accordion with a disabled item.
 * Disabled items cannot be expanded or collapsed.
 */
export const WithDisabledItem: Story = {
  args: {
    items: itemsWithDisabled,
    'aria-label': 'Accordion with disabled item',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Individual accordion items can be disabled by setting `disabled: true` on the item.',
      },
    },
  },
};

// ============================================================================
// Rich Content
// ============================================================================

const richContentItems: AccordionItem[] = [
  {
    id: '1',
    header: 'Getting Started',
    content: (
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Installation</h4>
        <pre
          style={{
            background: 'var(--surface-colour-hover)',
            padding: '0.5rem',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          <code>npm install @portfolio/components</code>
        </pre>
        <p style={{ marginTop: '0.5rem' }}>After installation, import the components you need:</p>
        <pre
          style={{
            background: 'var(--surface-colour-hover)',
            padding: '0.5rem',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          <code>{`import { Accordion } from '@portfolio/components';`}</code>
        </pre>
      </div>
    ),
  },
  {
    id: '2',
    header: 'Basic Usage',
    content: (
      <div>
        <p>Here's a simple example of using the Accordion component:</p>
        <pre
          style={{
            background: 'var(--surface-colour-hover)',
            padding: '0.5rem',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '0.875rem',
          }}
        >
          <code>{`<Accordion
  items={[
    { id: '1', header: 'Section 1', content: <p>Content</p> },
    { id: '2', header: 'Section 2', content: <p>Content</p> },
  ]}
/>`}</code>
        </pre>
      </div>
    ),
  },
  {
    id: '3',
    header: 'Advanced Features',
    content: (
      <div>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>
            Multiple expansion mode with <code>allowMultiple</code>
          </li>
          <li>
            Default expanded sections with <code>defaultExpanded</code>
          </li>
          <li>Disabled items for restricted content</li>
          <li>Full keyboard navigation support</li>
          <li>Smooth CSS animations with reduced motion support</li>
        </ul>
      </div>
    ),
  },
];

/**
 * Accordion with rich content including code blocks and lists.
 */
export const RichContent: Story = {
  args: {
    items: richContentItems,
    'aria-label': 'Documentation Accordion',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Accordion content can include any React elements, including code blocks, lists, and nested components.',
      },
    },
  },
};

// ============================================================================
// Controlled Example
// ============================================================================

/**
 * Controlled accordion with external state management.
 */
export const Controlled: Story = {
  render: () => {
    const [expanded, setExpanded] = useState<string[]>(['1']);

    return (
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
            Currently expanded: {expanded.length > 0 ? expanded.join(', ') : 'None'}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setExpanded(['1', '2', '3'])}
              style={{
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={() => setExpanded([])}
              style={{
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              Collapse All
            </button>
          </div>
        </div>
        <Accordion
          items={sampleItems}
          defaultExpanded={expanded}
          allowMultiple
          onChange={setExpanded}
          aria-label="Controlled Accordion"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use the `onChange` callback to track expansion state and implement controlled behavior.',
      },
    },
  },
};

// ============================================================================
// Keyboard Navigation Demo
// ============================================================================

/**
 * Demonstrates keyboard navigation.
 * Focus on a header and use arrow keys to navigate.
 */
export const KeyboardNavigation: Story = {
  args: {
    items: sampleItems,
    'aria-label': 'Keyboard Navigation Demo',
  },
  parameters: {
    docs: {
      description: {
        story: `
**Keyboard shortcuts:**
- **Arrow Down**: Move focus to next header
- **Arrow Up**: Move focus to previous header
- **Home**: Move focus to first header
- **End**: Move focus to last header
- **Enter/Space**: Toggle expansion of focused section
        `,
      },
    },
  },
};

// ============================================================================
// Long Content
// ============================================================================

const longContentItems: AccordionItem[] = [
  {
    id: '1',
    header: 'Terms of Service',
    content: (
      <div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
          deserunt mollit anim id est laborum.
        </p>
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
          laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
          architecto beatae vitae dicta sunt explicabo.
        </p>
      </div>
    ),
  },
  {
    id: '2',
    header: 'Privacy Policy',
    content: (
      <div>
        <p>
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
          consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
        </p>
        <p>
          Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
          velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam
          quaerat voluptatem.
        </p>
      </div>
    ),
  },
];

/**
 * Accordion with longer content to demonstrate smooth height animations.
 */
export const LongContent: Story = {
  args: {
    items: longContentItems,
    'aria-label': 'Legal Documents',
  },
  parameters: {
    docs: {
      description: {
        story: 'The accordion handles long content gracefully with smooth height animations.',
      },
    },
  },
};

// ============================================================================
// Single Item
// ============================================================================

/**
 * Accordion with a single item.
 */
export const SingleItem: Story = {
  args: {
    items: [sampleItems[0]],
    'aria-label': 'Single Item Accordion',
  },
  parameters: {
    docs: {
      description: {
        story: 'The accordion works correctly even with a single item.',
      },
    },
  },
};

// ============================================================================
// Many Items
// ============================================================================

const manyItems: AccordionItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1),
  header: `Section ${i + 1}`,
  content: (
    <p>Content for section {i + 1}. This demonstrates how the accordion handles many items.</p>
  ),
}));

/**
 * Accordion with many items.
 */
export const ManyItems: Story = {
  args: {
    items: manyItems,
    'aria-label': 'Many Items Accordion',
  },
  parameters: {
    docs: {
      description: {
        story: 'The accordion scales well with many items while maintaining smooth performance.',
      },
    },
  },
};
