/**
 * Design System Audit Script
 * Runs comprehensive audit of component library design system integration
 */

const fs = require('fs');
const path = require('path');

// Design system color families
const ALLOWED_COLOR_FAMILIES = [
  '$primary',
  '$secondary', 
  '$neutral',
  '$grey',
  '$success',
  '$warning',
  '$error',
  '$info'
];

// Hardcoded color patterns to detect
const HARDCODED_COLOR_PATTERNS = [
  /#[0-9a-fA-F]{3,8}/,  // Hex colors
  /rgb\([^)]+\)/,        // RGB colors
  /rgba\([^)]+\)/,       // RGBA colors
  /hsl\([^)]+\)/,        // HSL colors
  /hsla\([^)]+\)/        // HSLA colors
];

/**
 * Get all SCSS files in the component library
 */
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

/**
 * Audit color usage in a file
 */
function auditColorUsage(filePath, content) {
  const issues = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trim();
    
    // Skip comments and empty lines
    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || !trimmedLine) {
      return;
    }
    
    // Check for hardcoded colors
    HARDCODED_COLOR_PATTERNS.forEach(pattern => {
      const matches = line.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // Allow some exceptions for transparent and currentColor
          if (match !== 'transparent' && match !== 'currentColor') {
            // Check if it's using design system colors
            const isDesignSystemColor = ALLOWED_COLOR_FAMILIES.some(family => 
              line.includes(`map.get(${family}`)
            );
            
            // Check if it's a CSS custom property (theme-aware)
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

/**
 * Run color audit
 */
function runColorAudit(componentLibraryPath) {
  const scssFiles = getComponentScssFiles(componentLibraryPath);
  const results = [];
  
  scssFiles.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = filePath.replace(process.cwd(), '');
    
    const issues = auditColorUsage(filePath, content);
    results.push({
      file: relativePath,
      issues: issues,
      passed: issues.length === 0
    });
  });
  
  return results;
}

function main() {
  console.log('🔍 Starting Design System Color Audit...\n');
  
  const componentLibraryPath = path.join(process.cwd(), 'src/lib/components');
  
  try {
    const results = runColorAudit(componentLibraryPath);
    
    console.log('🎨 Color Usage Audit Results:');
    console.log('============================\n');
    
    const failedFiles = results.filter(r => !r.passed);
    const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
    
    if (failedFiles.length === 0) {
      console.log('✅ All components use design system colors correctly!');
    } else {
      failedFiles.forEach(result => {
        console.log(`❌ ${result.file}:`);
        result.issues.forEach(issue => console.log(`   - ${issue}`));
        console.log();
      });
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   Total files: ${results.length}`);
    console.log(`   Passed: ${results.length - failedFiles.length}`);
    console.log(`   Failed: ${failedFiles.length}`);
    console.log(`   Total issues: ${totalIssues}`);
    
    if (totalIssues > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  }
}

main();