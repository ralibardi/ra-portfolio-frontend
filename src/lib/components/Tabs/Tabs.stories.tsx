import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { TabItem } from '../types';
import { Tabs } from './index';

/**
 * The Tabs component organizes related content into switchable panels
 * following WAI-ARIA tabpanel patterns. It provides an intuitive way
 * to present multiple views of related information.
 *
 * ## Features
 * - **Controlled/Uncontrolled**: Use with or without external state management
 * - **Keyboard Navigation**: Arrow keys for navigation, Home/End for first/last
 * - **Orientations**: Horizontal (default) and vertical layouts
 * - **Disabled Tabs**: Individual tabs can be disabled
 * - **Accessibility**: Full ARIA support with proper roles and states
 * - **Focus Management**: Proper focus handling and visual indicators
 *
 * ## Usage Examples
 * ```tsx
 * // Basic tabs (uncontrolled)
 * <Tabs
 *   items={[
 *     {
 *       id: 'tab1',
 *       label: 'Overview',
 *       content: <div>Overview content</div>
 *     },
 *     {
 *       id: 'tab2',
 *       label: 'Details',
 *       content: <div>Details content</div>
 *     }
 *   ]}
 * />
 *
 * // Controlled tabs with state
 * <Tabs
 *   items={tabItems}
 *   selectedIndex={activeTab}
 *   onChange={setActiveTab}
 *   orientation="vertical"
 * />
 *
 * // Tabs with disabled items
 * <Tabs
 *   items={[
 *     { id: '1', label: 'Active', content: <Content1 /> },
 *     { id: '2', label: 'Disabled', content: <Content2 />, disabled: true }
 *   ]}
 * />
 * ```
 *
 * ## Keyboard Navigation
 * - **Tab**: Moves focus into/out of tab list
 * - **Arrow Left/Right**: Navigate between tabs (horizontal orientation)
 * - **Arrow Up/Down**: Navigate between tabs (vertical orientation)
 * - **Home**: Moves to first tab
 * - **End**: Moves to last tab
 * - **Space/Enter**: Activates focused tab
 *
 * ## Accessibility Features
 * - `role="tablist"` for the tab container
 * - `role="tab"` for individual tab buttons
 * - `role="tabpanel"` for content panels
 * - `aria-selected` indicates active tab
 * - `aria-controls` links tabs to their panels
 * - `aria-labelledby` links panels to their tabs
 * - `tabindex` management for keyboard navigation
 * - Focus indicators that meet WCAG standards
 *
 * ## Best Practices
 * - Use tabs for related content that users might want to compare
 * - Keep tab labels short and descriptive
 * - Don't use too many tabs (5-7 maximum recommended)
 * - Consider vertical orientation for narrow layouts
 * - Ensure content is meaningful when JavaScript is disabled
 * - Use consistent content structure across panels
 */
const meta: Meta<typeof Tabs> = {
  title: 'Layout/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A tabbed interface component for organizing content into switchable panels with full keyboard support and accessibility.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      description: 'Array of tab items with id, label, content, and optional disabled state',
      table: {
        type: { summary: 'TabItem[]' },
      },
    },
    defaultIndex: {
      control: { type: 'number', min: 0 },
      description: 'Default selected tab index (uncontrolled mode)',
      table: {
        defaultValue: { summary: '0' },
      },
    },
    selectedIndex: {
      control: { type: 'number', min: 0 },
      description: 'Selected tab index (controlled mode)',
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Tab list orientation',
      table: {
        defaultValue: { summary: 'horizontal' },
      },
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when selected tab changes',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label for the tab list',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample tab items
const sampleItems: TabItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    content: (
      <div>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Project Overview</h3>
        <p>
          This is the overview tab content. It provides a high-level summary of the project,
          including its goals, scope, and key features.
        </p>
      </div>
    ),
  },
  {
    id: 'features',
    label: 'Features',
    content: (
      <div>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Key Features</h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>Responsive design</li>
          <li>Accessibility compliant</li>
          <li>Keyboard navigation</li>
          <li>Theme support</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'documentation',
    label: 'Documentation',
    content: (
      <div>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Documentation</h3>
        <p>
          Comprehensive documentation is available for all components. Each component includes usage
          examples, prop descriptions, and accessibility guidelines.
        </p>
      </div>
    ),
  },
];

// ============================================================================
// Basic Stories
// ============================================================================

/**
 * The default tabs with horizontal orientation.
 */
export const Default: Story = {
  args: {
    items: sampleItems,
    'aria-label': 'Project Information',
  },
};

/**
 * Tabs with vertical orientation.
 * The tab list appears on the left side of the content.
 */
export const Vertical: Story = {
  args: {
    items: sampleItems,
    orientation: 'vertical',
    'aria-label': 'Project Information',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use `orientation="vertical"` for a side-by-side layout with tabs on the left.',
      },
    },
  },
};

/**
 * Tabs with a different default selected tab.
 */
export const DefaultIndex: Story = {
  args: {
    items: sampleItems,
    defaultIndex: 1,
    'aria-label': 'Project Information',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use `defaultIndex` to specify which tab should be selected on initial render.',
      },
    },
  },
};

// ============================================================================
// Disabled Tabs
// ============================================================================

const itemsWithDisabled: TabItem[] = [
  {
    id: 'active',
    label: 'Active Tab',
    content: <p>This tab is active and can be selected.</p>,
  },
  {
    id: 'disabled',
    label: 'Disabled Tab',
    content: <p>This content is not accessible because the tab is disabled.</p>,
    disabled: true,
  },
  {
    id: 'another',
    label: 'Another Tab',
    content: <p>This tab is also available for selection.</p>,
  },
];

/**
 * Tabs with a disabled tab.
 * Disabled tabs cannot be selected via click or keyboard.
 */
export const WithDisabledTab: Story = {
  args: {
    items: itemsWithDisabled,
    'aria-label': 'Tabs with disabled item',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Individual tabs can be disabled by setting `disabled: true` on the tab item. Disabled tabs are skipped during keyboard navigation.',
      },
    },
  },
};

// ============================================================================
// Controlled Example
// ============================================================================

/**
 * Controlled tabs with external state management.
 */
export const Controlled: Story = {
  render: () => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
            Currently selected: Tab {selectedIndex + 1} ({sampleItems[selectedIndex].label})
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {sampleItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                style={{
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: selectedIndex === index ? 'bold' : 'normal',
                }}
              >
                Go to {item.label}
              </button>
            ))}
          </div>
        </div>
        <Tabs
          items={sampleItems}
          selectedIndex={selectedIndex}
          onChange={setSelectedIndex}
          aria-label="Controlled Tabs"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use `selectedIndex` and `onChange` for controlled mode. The parent component manages the selected tab state.',
      },
    },
  },
};

// ============================================================================
// Keyboard Navigation Demo
// ============================================================================

/**
 * Demonstrates keyboard navigation.
 * Focus on a tab and use arrow keys to navigate.
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
**Keyboard shortcuts (horizontal):**
- **Arrow Right**: Move to next tab
- **Arrow Left**: Move to previous tab
- **Home**: Move to first tab
- **End**: Move to last tab

**Keyboard shortcuts (vertical):**
- **Arrow Down**: Move to next tab
- **Arrow Up**: Move to previous tab
- **Home**: Move to first tab
- **End**: Move to last tab
        `,
      },
    },
  },
};

// ============================================================================
// Rich Content
// ============================================================================

const richContentItems: TabItem[] = [
  {
    id: 'installation',
    label: 'Installation',
    content: (
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Getting Started</h4>
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
        <p style={{ marginTop: '0.5rem' }}>Then import the Tabs component:</p>
        <pre
          style={{
            background: 'var(--surface-colour-hover)',
            padding: '0.5rem',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          <code>{`import { Tabs } from '@portfolio/components';`}</code>
        </pre>
      </div>
    ),
  },
  {
    id: 'usage',
    label: 'Usage',
    content: (
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Basic Example</h4>
        <pre
          style={{
            background: 'var(--surface-colour-hover)',
            padding: '0.5rem',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '0.875rem',
          }}
        >
          <code>{`<Tabs
  items={[
    { id: '1', label: 'Tab 1', content: <p>Content 1</p> },
    { id: '2', label: 'Tab 2', content: <p>Content 2</p> },
  ]}
/>`}</code>
        </pre>
      </div>
    ),
  },
  {
    id: 'api',
    label: 'API',
    content: (
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Props</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr>
              <th
                style={{
                  textAlign: 'left',
                  padding: '0.5rem',
                  borderBottom: '1px solid var(--border-colour)',
                }}
              >
                Prop
              </th>
              <th
                style={{
                  textAlign: 'left',
                  padding: '0.5rem',
                  borderBottom: '1px solid var(--border-colour)',
                }}
              >
                Type
              </th>
              <th
                style={{
                  textAlign: 'left',
                  padding: '0.5rem',
                  borderBottom: '1px solid var(--border-colour)',
                }}
              >
                Default
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-colour)' }}>
                items
              </td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-colour)' }}>
                TabItem[]
              </td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-colour)' }}>
                required
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-colour)' }}>
                orientation
              </td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-colour)' }}>
                'horizontal' | 'vertical'
              </td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-colour)' }}>
                'horizontal'
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-colour)' }}>
                defaultIndex
              </td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-colour)' }}>
                number
              </td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-colour)' }}>
                0
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  },
];

/**
 * Tabs with rich content including code blocks and tables.
 */
export const RichContent: Story = {
  args: {
    items: richContentItems,
    'aria-label': 'Documentation Tabs',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Tab content can include any React elements, including code blocks, tables, and nested components.',
      },
    },
  },
};

// ============================================================================
// Many Tabs
// ============================================================================

const manyItems: TabItem[] = Array.from({ length: 8 }, (_, i) => ({
  id: String(i + 1),
  label: `Tab ${i + 1}`,
  content: <p>Content for tab {i + 1}. This demonstrates how the tabs handle many items.</p>,
}));

/**
 * Tabs with many items.
 */
export const ManyTabs: Story = {
  args: {
    items: manyItems,
    'aria-label': 'Many Tabs Example',
  },
  parameters: {
    docs: {
      description: {
        story: 'The tabs component handles many items while maintaining usability.',
      },
    },
  },
};

// ============================================================================
// Two Tabs
// ============================================================================

const twoItems: TabItem[] = [
  {
    id: 'tab1',
    label: 'First Tab',
    content: <p>Content for the first tab.</p>,
  },
  {
    id: 'tab2',
    label: 'Second Tab',
    content: <p>Content for the second tab.</p>,
  },
];

/**
 * Tabs with only two items.
 */
export const TwoTabs: Story = {
  args: {
    items: twoItems,
    'aria-label': 'Two Tabs Example',
  },
  parameters: {
    docs: {
      description: {
        story: 'The tabs component works correctly with just two items.',
      },
    },
  },
};

// ============================================================================
// Vertical with Disabled
// ============================================================================

/**
 * Vertical tabs with a disabled tab.
 */
export const VerticalWithDisabled: Story = {
  args: {
    items: itemsWithDisabled,
    orientation: 'vertical',
    'aria-label': 'Vertical Tabs with Disabled',
  },
  parameters: {
    docs: {
      description: {
        story: 'Vertical orientation combined with disabled tabs.',
      },
    },
  },
};
