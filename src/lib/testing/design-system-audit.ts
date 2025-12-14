/**
 * Design System Integration Audit
 * Validates that all components follow design system standards
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

interface AuditResult {
  file: string;
  issues: string[];
  passed: boolean;
}

interface AuditReport {
  colorAudit: AuditResult[];
  spacingAudit: AuditResult[];
  typographyAudit: AuditResult[];
  borderAudit: AuditResult[];
  summary: {
    totalFiles: number;
    passedFiles: number;
    failedFiles: number;
    totalIssues: number;
  };
}

// Design system color families
const ALLOWED_COLOR_FAMILIES = [
  '$primary',
  '$secondary',
  '$neutral',
  '$grey',
  '$success',
  '$warning',
  '$error',
  '$info',
];

// Design system spacing values
const ALLOWED_SPACING_PATTERN = /map\.get\(\$spacing,\s*['"][^'"]*['"]\)/;

// Design system typography values
const ALLOWED_FONT_SIZE_PATTERN = /map\.get\(\$font-sizes,\s*['"][^'"]*['"]\)/;
const ALLOWED_FONT_WEIGHT_PATTERN = /map\.get\(\$font-weights,\s*['"][^'"]*['"]\)/;

// Design system border values
const ALLOWED_BORDER_PATTERN = /map\.get\(\$border,\s*['"][^'"]*['"]\)/;

// Hardcoded color patterns to detect
const HARDCODED_COLOR_PATTERNS = [
  /#[0-9a-fA-F]{3,8}/, // Hex colors
  /rgb\([^)]+\)/, // RGB colors
  /rgba\([^)]+\)/, // RGBA colors
  /hsl\([^)]+\)/, // HSL colors
  /hsla\([^)]+\)/, // HSLA colors
];

// Hardcoded spacing patterns to detect
const HARDCODED_SPACING_PATTERNS = [
  /\d+px(?!\s*\/)/, // Pixel values (not in comments)
  /\d+rem(?!\s*\/)/, // Rem values (not in comments)
  /\d+em(?!\s*\/)/, // Em values (not in comments)
];

/**
 * Get all SCSS files in the component library
 */
function getComponentScssFiles(dir: string): string[] {
  const files: string[] = [];

  function traverse(currentDir: string) {
    const items = readdirSync(currentDir);

    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.scss') && !item.startsWith('_')) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

/**
 * Audit color usage in a file
 */
function auditColorUsage(_filePath: string, content: string): string[] {
  const issues: string[] = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trim();

    // Skip comments and empty lines
    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || !trimmedLine) {
      return;
    }

    // Check for hardcoded colors
    HARDCODED_COLOR_PATTERNS.forEach((pattern) => {
      const matches = line.match(pattern);
      if (matches) {
        matches.forEach((match) => {
          // Allow some exceptions for transparent and currentColor
          if (match !== 'transparent' && match !== 'currentColor') {
            // Check if it's using design system colors
            const isDesignSystemColor = ALLOWED_COLOR_FAMILIES.some((family) =>
              line.includes(`map.get(${family}`),
            );

            // Check if it's a CSS custom property (theme-aware)
            const isThemeAware = line.includes('var(--');

            if (!isDesignSystemColor && !isThemeAware) {
              issues.push(
                `Line ${lineNumber}: Hardcoded color "${match}" should use design system colors or theme-aware variables`,
              );
            }
          }
        });
      }
    });

    // Check for proper color family usage
    if (line.includes('map.get($') && line.includes('color')) {
      const hasValidColorFamily = ALLOWED_COLOR_FAMILIES.some((family) =>
        line.includes(`map.get(${family}`),
      );

      if (!hasValidColorFamily) {
        issues.push(
          `Line ${lineNumber}: Color should use allowed color families: ${ALLOWED_COLOR_FAMILIES.join(', ')}`,
        );
      }
    }
  });

  return issues;
}

/**
 * Audit spacing usage in a file
 */
function auditSpacingUsage(_filePath: string, content: string): string[] {
  const issues: string[] = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trim();

    // Skip comments and empty lines
    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || !trimmedLine) {
      return;
    }

    // Check for hardcoded spacing values
    HARDCODED_SPACING_PATTERNS.forEach((pattern) => {
      const matches = line.match(pattern);
      if (matches) {
        matches.forEach((match) => {
          // Check if it's using design system spacing
          const isDesignSystemSpacing = ALLOWED_SPACING_PATTERN.test(line);

          // Allow some exceptions (0, 100%, viewport units, etc.)
          const isAllowedException =
            match === '0px' ||
            match === '0rem' ||
            match === '0em' ||
            line.includes('%') ||
            line.includes('vh') ||
            line.includes('vw') ||
            line.includes('calc(') ||
            line.includes('min(') ||
            line.includes('max(');

          if (!isDesignSystemSpacing && !isAllowedException) {
            issues.push(
              `Line ${lineNumber}: Hardcoded spacing "${match}" should use design system spacing scale`,
            );
          }
        });
      }
    });
  });

  return issues;
}

/**
 * Check if a line should be skipped during audit
 */
function shouldSkipLine(line: string): boolean {
  const trimmedLine = line.trim();
  return trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || !trimmedLine;
}

/**
 * Check font-size usage in a line
 */
function checkFontSizeUsage(line: string, lineNumber: number): string | null {
  if (!line.includes('font-size:') || line.includes('inherit')) {
    return null;
  }

  const hasValidFontSize =
    ALLOWED_FONT_SIZE_PATTERN.test(line) ||
    line.includes('var(--') ||
    line.includes('@include typography');

  if (!hasValidFontSize) {
    return `Line ${lineNumber}: font-size should use design system font sizes or typography mixin`;
  }

  return null;
}

/**
 * Check font-weight usage in a line
 */
function checkFontWeightUsage(line: string, lineNumber: number): string | null {
  if (!line.includes('font-weight:') || line.includes('inherit')) {
    return null;
  }

  const hasValidFontWeight =
    ALLOWED_FONT_WEIGHT_PATTERN.test(line) ||
    line.includes('var(--') ||
    line.includes('@include typography');

  if (!hasValidFontWeight) {
    return `Line ${lineNumber}: font-weight should use design system font weights or typography mixin`;
  }

  return null;
}

/**
 * Audit typography usage in a file
 */
function auditTypographyUsage(_filePath: string, content: string): string[] {
  const issues: string[] = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    if (shouldSkipLine(line)) {
      return;
    }

    const fontSizeIssue = checkFontSizeUsage(line, lineNumber);
    if (fontSizeIssue) {
      issues.push(fontSizeIssue);
    }

    const fontWeightIssue = checkFontWeightUsage(line, lineNumber);
    if (fontWeightIssue) {
      issues.push(fontWeightIssue);
    }
  });

  return issues;
}

/**
 * Check border-radius usage in a line
 */
function checkBorderRadiusUsage(line: string, lineNumber: number): string | null {
  if (!line.includes('border-radius:') || line.includes('inherit')) {
    return null;
  }

  const hasValidBorderRadius =
    ALLOWED_BORDER_PATTERN.test(line) ||
    line.includes('@include border-radius') ||
    line.includes('50%'); // Allow circle

  if (!hasValidBorderRadius) {
    return `Line ${lineNumber}: border-radius should use design system border values or border-radius mixin`;
  }

  return null;
}

/**
 * Check border-width usage in a line
 */
function checkBorderWidthUsage(line: string, lineNumber: number): string | null {
  if (!line.includes('border-width:') && !(line.includes('border:') && !line.includes('none'))) {
    return null;
  }

  const hasValidBorderWidth = ALLOWED_BORDER_PATTERN.test(line) || line.includes('var(--');

  if (!hasValidBorderWidth && !line.includes('0')) {
    return `Line ${lineNumber}: border-width should use design system border values`;
  }

  return null;
}

/**
 * Audit border usage in a file
 */
function auditBorderUsage(_filePath: string, content: string): string[] {
  const issues: string[] = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    if (shouldSkipLine(line)) {
      return;
    }

    const borderRadiusIssue = checkBorderRadiusUsage(line, lineNumber);
    if (borderRadiusIssue) {
      issues.push(borderRadiusIssue);
    }

    const borderWidthIssue = checkBorderWidthUsage(line, lineNumber);
    if (borderWidthIssue) {
      issues.push(borderWidthIssue);
    }
  });

  return issues;
}

/**
 * Run complete design system audit
 */
export function runDesignSystemAudit(componentLibraryPath: string): AuditReport {
  const scssFiles = getComponentScssFiles(componentLibraryPath);

  const colorAudit: AuditResult[] = [];
  const spacingAudit: AuditResult[] = [];
  const typographyAudit: AuditResult[] = [];
  const borderAudit: AuditResult[] = [];

  scssFiles.forEach((filePath) => {
    const content = readFileSync(filePath, 'utf-8');
    const relativePath = filePath.replace(process.cwd(), '');

    // Color audit
    const colorIssues = auditColorUsage(filePath, content);
    colorAudit.push({
      file: relativePath,
      issues: colorIssues,
      passed: colorIssues.length === 0,
    });

    // Spacing audit
    const spacingIssues = auditSpacingUsage(filePath, content);
    spacingAudit.push({
      file: relativePath,
      issues: spacingIssues,
      passed: spacingIssues.length === 0,
    });

    // Typography audit
    const typographyIssues = auditTypographyUsage(filePath, content);
    typographyAudit.push({
      file: relativePath,
      issues: typographyIssues,
      passed: typographyIssues.length === 0,
    });

    // Border audit
    const borderIssues = auditBorderUsage(filePath, content);
    borderAudit.push({
      file: relativePath,
      issues: borderIssues,
      passed: borderIssues.length === 0,
    });
  });

  const totalFiles = scssFiles.length;
  const passedFiles = colorAudit.filter((r) => r.passed).length;
  const failedFiles = totalFiles - passedFiles;
  const totalIssues = [...colorAudit, ...spacingAudit, ...typographyAudit, ...borderAudit].reduce(
    (sum, result) => sum + result.issues.length,
    0,
  );

  return {
    colorAudit,
    spacingAudit,
    typographyAudit,
    borderAudit,
    summary: {
      totalFiles,
      passedFiles,
      failedFiles,
      totalIssues,
    },
  };
}

/**
 * Print audit report to console
 */
export function printAuditReport(report: AuditReport): void {
  // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
  console.log('\n🎨 Design System Integration Audit Report');
  // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
  console.log('==========================================\n');

  // Summary
  // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
  console.log('📊 Summary:');
  // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
  console.log(`   Total files audited: ${report.summary.totalFiles}`);
  // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
  console.log(`   Files passed: ${report.summary.passedFiles}`);
  // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
  console.log(`   Files with issues: ${report.summary.failedFiles}`);
  // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
  console.log(`   Total issues found: ${report.summary.totalIssues}\n`);

  // Color audit results
  // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
  console.log('🎨 Color Usage Audit:');
  const colorIssues = report.colorAudit.filter((r) => !r.passed);
  if (colorIssues.length === 0) {
    // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
    console.log('   ✅ All components use design system colors correctly\n');
  } else {
    colorIssues.forEach((result) => {
      // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
      console.log(`   ❌ ${result.file}:`);
      result.issues.forEach((issue) => {
        // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
        console.log(`      - ${issue}`);
      });
    });
    // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
    console.log();
  }

  // Spacing audit results
  // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
  console.log('📏 Spacing Usage Audit:');
  const spacingIssues = report.spacingAudit.filter((r) => !r.passed);
  if (spacingIssues.length === 0) {
    // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
    console.log('   ✅ All components use design system spacing correctly\n');
  } else {
    spacingIssues.forEach((result) => {
      // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
      console.log(`   ❌ ${result.file}:`);
      result.issues.forEach((issue) => {
        // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
        console.log(`      - ${issue}`);
      });
    });
    // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
    console.log();
  }

  // Typography audit results
  // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
  console.log('🔤 Typography Usage Audit:');
  const typographyIssues = report.typographyAudit.filter((r) => !r.passed);
  if (typographyIssues.length === 0) {
    // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
    console.log('   ✅ All components use design system typography correctly\n');
  } else {
    typographyIssues.forEach((result) => {
      // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
      console.log(`   ❌ ${result.file}:`);
      result.issues.forEach((issue) => {
        // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
        console.log(`      - ${issue}`);
      });
    });
    // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
    console.log();
  }

  // Border audit results
  // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
  console.log('🔲 Border Usage Audit:');
  const borderIssues = report.borderAudit.filter((r) => !r.passed);
  if (borderIssues.length === 0) {
    // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
    console.log('   ✅ All components use design system borders correctly\n');
  } else {
    borderIssues.forEach((result) => {
      // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
      console.log(`   ❌ ${result.file}:`);
      result.issues.forEach((issue) => {
        // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
        console.log(`      - ${issue}`);
      });
    });
    // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
    console.log();
  }

  // Overall result
  if (report.summary.totalIssues === 0) {
    // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
    console.log('🎉 All components follow design system standards!');
  } else {
    // biome-ignore lint/suspicious/noConsole: This is a development audit tool that needs console output
    console.log(
      `⚠️  Found ${report.summary.totalIssues} design system violations that need attention.`,
    );
  }
}
