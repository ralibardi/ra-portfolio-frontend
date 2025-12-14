/**
 * Comprehensive Design System Audit Script
 * Audits color, spacing, typography, and border usage
 */

const fs = require('fs');
const path = require('path');

// Design system patterns
const ALLOWED_COLOR_FAMILIES = ['$primary', '$secondary', '$neutral', '$grey', '$success', '$warning', '$error', '$info'];
const HARDCODED_COLOR_PATTERNS = [/#[0-9a-fA-F]{3,8}/, /rgb\([^)]+\)/, /rgba\([^)]+\)/, /hsl\([^)]+\)/, /hsla\([^)]+\)/];
const HARDCODED_SPACING_PATTERNS = [/\d+px(?!\s*\/)/, /\d+rem(?!\s*\/)/, /\d+em(?!\s*\/)/];
const ALLOWED_SPACING_PATTERN = /map\.get\(\$spacing,\s*['"][^'"]*['"]\)/;
const ALLOWED_FONT_SIZE_PATTERN = /map\.get\(\$font-sizes,\s*['"][^'"]*['"]\)/;
const ALLOWED_FONT_WEIGHT_PATTERN = /map\.get\(\$font-weights,\s*['"][^'"]*['"]\)/;
const ALLOWED_BORDER_PATTERN = /map\.get\(\$border,\s*['"][^'"]*['"]\)/;

function getComponentScssFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
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

function auditColorUsage(content) {
  const issues = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || !trimmedLine) {
      return;
    }
    
    HARDCODED_COLOR_PATTERNS.forEach(pattern => {
      const matches = line.match(pattern);
      if (matches) {
        matches.forEach(match => {
          if (match !== 'transparent' && match !== 'currentColor') {
            const isDesignSystemColor = ALLOWED_COLOR_FAMILIES.some(family => 
              line.includes(`map.get(${family}`)
            );
            const isThemeAware = line.includes('var(--');
            
            if (!isDesignSystemColor && !isThemeAware) {
              issues.push(`Line ${lineNumber}: Hardcoded color "${match}" should use design system colors or theme-aware variables`);
            }
          }
        });
      }
    });
  });
  
  return issues;
}

function auditSpacingUsage(content) {
  const issues = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || !trimmedLine) {
      return;
    }
    
    HARDCODED_SPACING_PATTERNS.forEach(pattern => {
      const matches = line.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const isDesignSystemSpacing = ALLOWED_SPACING_PATTERN.test(line);
          const isAllowedException = match === '0px' || match === '0rem' || match === '0em' ||
                                   line.includes('%') || line.includes('vh') || line.includes('vw') ||
                                   line.includes('calc(') || line.includes('min(') || line.includes('max(') ||
                                   line.includes('100%') || line.includes('50%');
          
          if (!isDesignSystemSpacing && !isAllowedException) {
            issues.push(`Line ${lineNumber}: Hardcoded spacing "${match}" should use design system spacing scale`);
          }
        });
      }
    });
  });
  
  return issues;
}

function auditTypographyUsage(content) {
  const issues = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || !trimmedLine) {
      return;
    }
    
    if (line.includes('font-size:') && !line.includes('inherit')) {
      const hasValidFontSize = ALLOWED_FONT_SIZE_PATTERN.test(line) || 
                              line.includes('var(--') ||
                              line.includes('@include typography');
      
      if (!hasValidFontSize) {
        issues.push(`Line ${lineNumber}: font-size should use design system font sizes or typography mixin`);
      }
    }
    
    if (line.includes('font-weight:') && !line.includes('inherit')) {
      const hasValidFontWeight = ALLOWED_FONT_WEIGHT_PATTERN.test(line) ||
                                line.includes('var(--') ||
                                line.includes('@include typography');
      
      if (!hasValidFontWeight) {
        issues.push(`Line ${lineNumber}: font-weight should use design system font weights or typography mixin`);
      }
    }
  });
  
  return issues;
}

function auditBorderUsage(content) {
  const issues = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || !trimmedLine) {
      return;
    }
    
    if (line.includes('border-radius:') && !line.includes('inherit')) {
      const hasValidBorderRadius = ALLOWED_BORDER_PATTERN.test(line) ||
                                  line.includes('@include border-radius') ||
                                  line.includes('50%');
      
      if (!hasValidBorderRadius) {
        issues.push(`Line ${lineNumber}: border-radius should use design system border values or border-radius mixin`);
      }
    }
    
    if (line.includes('border-width:') || (line.includes('border:') && !line.includes('none'))) {
      const hasValidBorderWidth = ALLOWED_BORDER_PATTERN.test(line) ||
                                 line.includes('var(--');
      
      if (!hasValidBorderWidth && !line.includes('0')) {
        issues.push(`Line ${lineNumber}: border-width should use design system border values`);
      }
    }
  });
  
  return issues;
}

function checkReducedMotionSupport(content) {
  const hasAnimations = content.includes('animation:') || content.includes('@keyframes') || content.includes('transition:');
  const hasReducedMotionSupport = content.includes('@include prefers-reduced-motion') || content.includes('@media (prefers-reduced-motion');
  
  return {
    hasAnimations,
    hasReducedMotionSupport,
    compliant: !hasAnimations || hasReducedMotionSupport
  };
}

function main() {
  console.log('🔍 Starting Comprehensive Design System Audit...\n');
  
  const componentLibraryPath = path.join(process.cwd(), 'src/lib/components');
  const scssFiles = getComponentScssFiles(componentLibraryPath);
  
  const results = {
    color: [],
    spacing: [],
    typography: [],
    border: [],
    reducedMotion: []
  };
  
  scssFiles.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = filePath.replace(process.cwd(), '');
    
    // Color audit
    const colorIssues = auditColorUsage(content);
    results.color.push({
      file: relativePath,
      issues: colorIssues,
      passed: colorIssues.length === 0
    });
    
    // Spacing audit
    const spacingIssues = auditSpacingUsage(content);
    results.spacing.push({
      file: relativePath,
      issues: spacingIssues,
      passed: spacingIssues.length === 0
    });
    
    // Typography audit
    const typographyIssues = auditTypographyUsage(content);
    results.typography.push({
      file: relativePath,
      issues: typographyIssues,
      passed: typographyIssues.length === 0
    });
    
    // Border audit
    const borderIssues = auditBorderUsage(content);
    results.border.push({
      file: relativePath,
      issues: borderIssues,
      passed: borderIssues.length === 0
    });
    
    // Reduced motion audit
    const motionCheck = checkReducedMotionSupport(content);
    results.reducedMotion.push({
      file: relativePath,
      issues: motionCheck.compliant ? [] : ['Missing @include prefers-reduced-motion support for animations'],
      passed: motionCheck.compliant,
      hasAnimations: motionCheck.hasAnimations
    });
  });
  
  // Print results
  console.log('🎨 Design System Integration Audit Results');
  console.log('==========================================\n');
  
  const categories = [
    { name: 'Color Usage', key: 'color', emoji: '🎨' },
    { name: 'Spacing Usage', key: 'spacing', emoji: '📏' },
    { name: 'Typography Usage', key: 'typography', emoji: '🔤' },
    { name: 'Border Usage', key: 'border', emoji: '🔲' },
    { name: 'Reduced Motion Support', key: 'reducedMotion', emoji: '♿' }
  ];
  
  let totalIssues = 0;
  
  categories.forEach(category => {
    console.log(`${category.emoji} ${category.name}:`);
    const categoryResults = results[category.key];
    const failedFiles = categoryResults.filter(r => !r.passed);
    const categoryIssues = categoryResults.reduce((sum, r) => sum + r.issues.length, 0);
    totalIssues += categoryIssues;
    
    if (failedFiles.length === 0) {
      console.log('   ✅ All components comply with design system standards\n');
    } else {
      failedFiles.forEach(result => {
        console.log(`   ❌ ${result.file}:`);
        result.issues.forEach(issue => console.log(`      - ${issue}`));
      });
      console.log();
    }
  });
  
  // Summary
  console.log('📊 Overall Summary:');
  console.log(`   Total files audited: ${scssFiles.length}`);
  console.log(`   Total issues found: ${totalIssues}`);
  
  if (totalIssues === 0) {
    console.log('\n🎉 All components follow design system standards perfectly!');
  } else {
    console.log(`\n⚠️  Found ${totalIssues} design system violations that need attention.`);
    process.exit(1);
  }
}

main();