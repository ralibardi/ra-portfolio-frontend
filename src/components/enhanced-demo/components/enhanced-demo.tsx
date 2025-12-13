import { type FunctionComponent, memo } from 'react';

import styles from '../assets/enhanced-demo.module.scss';

/**
 * EnhancedDemo Component
 *
 * A demonstration component showcasing the enhanced styling system
 * with CSS Modules and the 7-1 SCSS pattern. This component serves
 * as a reference implementation for design token usage.
 */

interface IEnhancedDemoProps {
  /** Optional title for the demo section */
  title?: string;
  /** Whether to show all demo variants */
  showAllVariants?: boolean;
}

const EnhancedDemo: FunctionComponent<IEnhancedDemoProps> = memo(
  ({ title = 'Enhanced Styling Demo', showAllVariants = true }) => {
    return (
      <div className={styles.container} data-testid="enhanced-demo-container">
        <h2 className={styles.title} data-testid="enhanced-demo-title">
          {title}
        </h2>

        {showAllVariants && (
          <>
            <section className={styles.section} data-testid="enhanced-demo-success-section">
              <h3 className={styles.sectionTitle}>Success Variant</h3>
              <div className={styles.demoComponent} data-testid="enhanced-demo-success">
                <p className={styles.description}>
                  This demonstrates the success semantic color with enhanced typography and
                  transitions.
                </p>
              </div>
            </section>

            <section className={styles.section} data-testid="enhanced-demo-warning-section">
              <h3 className={styles.sectionTitle}>Warning Variant</h3>
              <div className={styles.warningDemo} data-testid="enhanced-demo-warning">
                <p className={styles.description}>
                  Warning messages use a left border accent with alpha background.
                </p>
              </div>
            </section>

            <section className={styles.section} data-testid="enhanced-demo-error-section">
              <h3 className={styles.sectionTitle}>Error Variant</h3>
              <div className={styles.errorDemo} data-testid="enhanced-demo-error">
                <p className={styles.description}>
                  Error states use semantic error colors with rounded corners.
                </p>
              </div>
            </section>

            <section className={styles.section} data-testid="enhanced-demo-info-section">
              <h3 className={styles.sectionTitle}>Info Variant</h3>
              <div className={styles.infoDemo} data-testid="enhanced-demo-info">
                <p className={styles.description}>
                  Informational content uses the info semantic color palette.
                </p>
              </div>
            </section>
          </>
        )}
      </div>
    );
  },
);

EnhancedDemo.displayName = 'EnhancedDemo';

export default EnhancedDemo;
