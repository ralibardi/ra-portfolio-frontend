# Manual Accessibility Testing Guide

This guide provides step-by-step instructions for manually testing the accessibility features of all components in the component library. These tests complement the automated jest-axe tests and ensure comprehensive WCAG 2.1 AA compliance.

## Testing Environment Setup

### Required Tools

- **Screen Reader**: NVDA (Windows), VoiceOver (macOS), or ORCA (Linux)
- **Browser**: Latest Chrome, Firefox, Safari, or Edge
- **Keyboard**: Physical keyboard for navigation testing
- **Color Contrast Analyzer**: WebAIM Contrast Checker or similar tool

### Browser Settings

- Ensure JavaScript is enabled
- Test with browser zoom at 100%, 150%, and 200%
- Test with high contrast mode enabled (if available)
- Test with reduced motion preferences enabled

## Component Testing Procedures

### 1. Button Component

#### Keyboard Navigation Tests

1. **Tab Navigation**

   - [ ] Tab to button - should receive visible focus indicator
   - [ ] Press Enter - should trigger onClick handler
   - [ ] Press Space - should trigger onClick handler
   - [ ] Tab away - focus should move to next focusable element

2. **Disabled State**

   - [ ] Disabled button should not receive focus
   - [ ] Screen reader should announce "disabled" or "unavailable"
   - [ ] Keyboard activation should not work

3. **Loading State**

   - [ ] Loading button should remain focusable
   - [ ] Screen reader should announce loading state
   - [ ] Keyboard activation should be prevented during loading

4. **Icon-Only Buttons**
   - [ ] Must have aria-label or accessible name
   - [ ] Screen reader should announce button purpose
   - [ ] Focus indicator should be clearly visible

#### Screen Reader Tests

1. **Content Announcement**

   - [ ] Button text should be announced clearly
   - [ ] Button role should be announced ("button")
   - [ ] State information (disabled, pressed) should be announced

2. **Icon Buttons**
   - [ ] Icon should be hidden from screen reader (aria-hidden="true")
   - [ ] Accessible name should describe button purpose
   - [ ] No redundant "button" announcements

### 2. Form Components

#### Input Component

1. **Label Association**

   - [ ] Click label should focus input
   - [ ] Screen reader should announce label when input is focused
   - [ ] Required inputs should announce "required"

2. **Error States**

   - [ ] Error messages should be announced when input receives focus
   - [ ] Error state should be visually distinct
   - [ ] aria-invalid should be set to "true" for invalid inputs

3. **Helper Text**
   - [ ] Helper text should be announced with input
   - [ ] Should be associated via aria-describedby

#### Select Component

1. **Keyboard Navigation**

   - [ ] Arrow keys should navigate options
   - [ ] Enter/Space should open dropdown
   - [ ] Escape should close dropdown
   - [ ] Type-ahead should work for option selection

2. **Screen Reader Announcements**
   - [ ] Current selection should be announced
   - [ ] Number of options should be announced
   - [ ] Option changes should be announced during navigation

#### Checkbox Component

1. **State Announcements**

   - [ ] Checked state should be announced
   - [ ] Unchecked state should be announced
   - [ ] Indeterminate state should be announced (if supported)

2. **Keyboard Interaction**
   - [ ] Space should toggle checkbox
   - [ ] Enter should not toggle (unless in form)

#### Radio Group Component

1. **Group Navigation**

   - [ ] Arrow keys should move between radio buttons in group
   - [ ] Only one radio should be selectable per group
   - [ ] Tab should move to selected radio or first if none selected

2. **Announcements**
   - [ ] Group label should be announced
   - [ ] Current selection should be announced
   - [ ] Position in group should be announced ("1 of 3")

### 3. Accordion Component

#### Keyboard Navigation

1. **Header Navigation**

   - [ ] Tab should move between accordion headers
   - [ ] Arrow keys should move between headers (optional)
   - [ ] Enter/Space should expand/collapse sections

2. **Content Navigation**
   - [ ] Tab should move into expanded content
   - [ ] Focus should be manageable within content
   - [ ] Tab should move to next accordion header after content

#### ARIA Attributes

1. **State Management**

   - [ ] aria-expanded should reflect current state
   - [ ] aria-controls should reference content panel
   - [ ] Content panel should have proper role

2. **Screen Reader Experience**
   - [ ] Expansion state should be announced
   - [ ] Content should be announced when expanded
   - [ ] Collapsed content should not be announced

### 4. Modal Component

#### Focus Management

1. **Focus Trapping**

   - [ ] Focus should move to modal when opened
   - [ ] Tab should cycle only within modal content
   - [ ] Shift+Tab should cycle backwards within modal
   - [ ] Focus should not escape modal

2. **Focus Restoration**
   - [ ] Focus should return to trigger element when modal closes
   - [ ] Focus should be restored even if trigger is removed

#### Keyboard Interaction

1. **Modal Controls**

   - [ ] Escape should close modal (if enabled)
   - [ ] Click outside should close modal (if enabled)
   - [ ] Close button should be keyboard accessible

2. **Background Interaction**
   - [ ] Background content should not be interactive
   - [ ] Screen reader should not access background content
   - [ ] Background scrolling should be prevented

#### ARIA Attributes

1. **Modal Semantics**
   - [ ] role="dialog" should be present
   - [ ] aria-modal="true" should be set
   - [ ] aria-labelledby should reference modal title
   - [ ] aria-describedby should reference modal description

### 5. Tabs Component

#### Keyboard Navigation

1. **Tab List Navigation**

   - [ ] Arrow keys should move between tabs
   - [ ] Home/End should move to first/last tab
   - [ ] Tab should move to active tab panel
   - [ ] Enter/Space should activate focused tab

2. **Tab Panel Navigation**
   - [ ] Tab should move through panel content
   - [ ] Shift+Tab should move back to tab list
   - [ ] Focus should remain in active panel

#### ARIA Attributes

1. **Tab Structure**

   - [ ] Tablist should have role="tablist"
   - [ ] Tabs should have role="tab"
   - [ ] Panels should have role="tabpanel"
   - [ ] aria-selected should reflect active tab

2. **Relationships**
   - [ ] aria-controls should link tab to panel
   - [ ] aria-labelledby should link panel to tab
   - [ ] Only active tab should have aria-selected="true"

### 6. Alert Component

#### Screen Reader Announcements

1. **Alert Roles**

   - [ ] Error alerts should use role="alert" (assertive)
   - [ ] Info alerts should use role="status" (polite)
   - [ ] Alerts should be announced immediately when shown

2. **Content Structure**
   - [ ] Alert title should be properly structured
   - [ ] Alert content should be accessible
   - [ ] Close button should be keyboard accessible

### 7. Tooltip Component

#### Keyboard Interaction

1. **Trigger Behavior**

   - [ ] Focus on trigger should show tooltip
   - [ ] Blur from trigger should hide tooltip
   - [ ] Escape should hide tooltip

2. **Content Access**
   - [ ] Tooltip content should be announced with trigger
   - [ ] Tooltip should not trap focus
   - [ ] Tooltip should not interfere with navigation

#### ARIA Attributes

1. **Tooltip Semantics**
   - [ ] role="tooltip" should be present
   - [ ] aria-describedby should link trigger to tooltip
   - [ ] Tooltip should have unique ID

### 8. Pagination Component

#### Keyboard Navigation

1. **Page Navigation**

   - [ ] Tab should move between page controls
   - [ ] Arrow keys should move between pages (optional)
   - [ ] Enter/Space should activate page links

2. **State Announcements**
   - [ ] Current page should be announced
   - [ ] Page numbers should be announced
   - [ ] Disabled states should be announced

## Color Contrast Testing

### Automated Testing

Run the following tools to verify color contrast:

- WebAIM Contrast Checker
- Colour Contrast Analyser (CCA)
- Browser developer tools accessibility panel

### Manual Verification

1. **Text Contrast**

   - [ ] Normal text: minimum 4.5:1 ratio
   - [ ] Large text (18pt+): minimum 3:1 ratio
   - [ ] UI components: minimum 3:1 ratio

2. **State Indicators**

   - [ ] Focus indicators have sufficient contrast
   - [ ] Error states are distinguishable
   - [ ] Disabled states are clearly indicated

3. **Interactive Elements**
   - [ ] Button text has sufficient contrast
   - [ ] Link text has sufficient contrast
   - [ ] Form labels have sufficient contrast

## High Contrast Mode Testing

### Windows High Contrast

1. Enable Windows High Contrast mode
2. Test all components for:
   - [ ] Visibility of all text
   - [ ] Visibility of focus indicators
   - [ ] Proper color inheritance
   - [ ] No missing content

### Browser High Contrast

1. Enable browser high contrast extensions
2. Verify component functionality remains intact

## Zoom and Responsive Testing

### Zoom Levels

Test at the following zoom levels:

- [ ] 100% (baseline)
- [ ] 150% (moderate zoom)
- [ ] 200% (high zoom)
- [ ] 400% (maximum required by WCAG)

### Responsive Behavior

1. **Layout Integrity**

   - [ ] No horizontal scrolling at standard widths
   - [ ] Content remains readable
   - [ ] Interactive elements remain accessible

2. **Touch Targets**
   - [ ] Minimum 44px touch target size
   - [ ] Adequate spacing between targets
   - [ ] No overlapping interactive elements

## Reduced Motion Testing

### Browser Settings

1. Enable "prefers-reduced-motion: reduce" in browser
2. Test all animated components:
   - [ ] Animations are disabled or reduced
   - [ ] Functionality remains intact
   - [ ] No essential information is lost

### Component-Specific Tests

1. **Loading States**

   - [ ] Spinners respect reduced motion
   - [ ] Skeleton animations are reduced
   - [ ] Transitions are minimized

2. **Interactive Feedback**
   - [ ] Hover effects are reduced
   - [ ] Focus transitions are simplified
   - [ ] Modal animations are reduced

## Screen Reader Testing Procedures

### NVDA (Windows)

1. Start NVDA screen reader
2. Navigate to component library
3. Test each component systematically
4. Verify announcements match expected behavior

### VoiceOver (macOS)

1. Enable VoiceOver (Cmd+F5)
2. Use VoiceOver cursor to navigate
3. Test rotor navigation for headings, links, form controls
4. Verify proper announcement of component states

### Testing Checklist for Each Component

- [ ] Component role is announced correctly
- [ ] Component state is announced (expanded, selected, etc.)
- [ ] Content is announced in logical order
- [ ] Interactive elements are clearly identified
- [ ] Relationships between elements are clear
- [ ] No redundant or confusing announcements

## Documentation Requirements

### Storybook Documentation

Each component story should include:

- [ ] Accessibility features description
- [ ] Keyboard shortcuts documentation
- [ ] ARIA attributes explanation
- [ ] Screen reader behavior notes
- [ ] Color contrast information

### Component README

Each component should document:

- [ ] Required ARIA attributes
- [ ] Keyboard interaction patterns
- [ ] Screen reader considerations
- [ ] Accessibility best practices
- [ ] Common accessibility pitfalls to avoid

## Testing Report Template

### Component: [Component Name]

**Date Tested:** [Date]
**Tester:** [Name]
**Tools Used:** [List of tools]

#### Test Results

- **Keyboard Navigation:** ✅ Pass / ❌ Fail
- **Screen Reader:** ✅ Pass / ❌ Fail
- **Color Contrast:** ✅ Pass / ❌ Fail
- **High Contrast Mode:** ✅ Pass / ❌ Fail
- **Zoom Testing:** ✅ Pass / ❌ Fail
- **Reduced Motion:** ✅ Pass / ❌ Fail

#### Issues Found

1. [Description of issue]
   - **Severity:** High/Medium/Low
   - **WCAG Criterion:** [e.g., 2.1.1 Keyboard]
   - **Recommended Fix:** [Description]

#### Overall Assessment

- **WCAG 2.1 AA Compliant:** ✅ Yes / ❌ No
- **Recommendations:** [List of improvements]

## Continuous Testing

### Integration with Development

1. **Pre-commit Testing**

   - Run automated accessibility tests
   - Verify no new violations introduced

2. **Code Review Checklist**

   - Accessibility considerations documented
   - ARIA attributes properly implemented
   - Keyboard navigation tested
   - Color contrast verified

3. **Regular Audits**
   - Monthly comprehensive accessibility review
   - Update testing procedures as needed
   - Train team members on accessibility testing

This manual testing guide ensures comprehensive accessibility coverage beyond what automated tools can detect, focusing on the actual user experience for people using assistive technologies.
