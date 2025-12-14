/**
 * Icon Import Optimization Analyzer
 * 
 * This script analyzes FontAwesome icon usage patterns and provides
 * recommendations for optimal tree-shaking and bundle size reduction.
 * 
 * Requirements Validated:
 * - Bundle size optimization (Task 18.1)
 * - Tree-shaking effectiveness for icons
 * - Import pattern analysis
 * 
 * Usage:
 *   pnpm run analyze-icons
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

// ES Module compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface IconUsage {
  iconName: string;
  importPath: string;
  files: string[];
  isTreeShakeable: boolean;
}

interface IconAnalysis {
  totalIcons: number;
  uniqueIcons: number;
  treeShakeableIcons: number;
  nonTreeShakeableIcons: number;
  iconUsages: IconUsage[];
  recommendations: string[];
  optimizationOpportunities: string[];
}

function scanForIconImports(dirPath: string, basePath: string = ''): Map<string, IconUsage> {
  const iconUsages = new Map<string, IconUsage>();
  
  if (!fs.existsSync(dirPath)) {
    return iconUsages;
  }
  
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.join(basePath, entry.name);
    
    if (entry.isDirectory()) {
      // Skip certain directories
      if (['node_modules', '.git', 'dist', 'coverage'].includes(entry.name)) {
        continue;
      }
      const subUsages = scanForIconImports(fullPath, relativePath);
      for (const [key, usage] of subUsages) {
        if (iconUsages.has(key)) {
          iconUsages.get(key)!.files.push(...usage.files);
        } else {
          iconUsages.set(key, usage);
        }
      }
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const lines = content.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          
          // Check for FontAwesome imports
          if (line.includes('@fortawesome/')) {
            const iconMatches = line.match(/\b(fa[A-Z][a-zA-Z]*)\b/g);
            if (iconMatches) {
              for (const iconName of iconMatches) {
                // Determine import path and tree-shaking capability
                let importPath = '';
                let isTreeShakeable = false;
                
                if (line.includes('@fortawesome/free-solid-svg-icons')) {
                  importPath = '@fortawesome/free-solid-svg-icons';
                  isTreeShakeable = line.includes('{') && line.includes('}'); // Named import
                } else if (line.includes('@fortawesome/free-brands-svg-icons')) {
                  importPath = '@fortawesome/free-brands-svg-icons';
                  isTreeShakeable = line.includes('{') && line.includes('}');
                } else if (line.includes('@fortawesome/free-regular-svg-icons')) {
                  importPath = '@fortawesome/free-regular-svg-icons';
                  isTreeShakeable = line.includes('{') && line.includes('}');
                } else if (line.includes('@fortawesome/react-fontawesome')) {
                  importPath = '@fortawesome/react-fontawesome';
                  isTreeShakeable = true; // FontAwesome component is always tree-shakeable
                }
                
                const key = `${iconName}:${importPath}`;
                if (iconUsages.has(key)) {
                  iconUsages.get(key)!.files.push(relativePath);
                } else {
                  iconUsages.set(key, {
                    iconName,
                    importPath,
                    files: [relativePath],
                    isTreeShakeable,
                  });
                }
              }
            }
          }
        }
      } catch (error) {
        // Skip files that can't be read
        console.warn(`Warning: Could not read file ${fullPath}`);
      }
    }
  }
  
  return iconUsages;
}

function analyzeIconUsage(): IconAnalysis {
  console.log('🎯 Analyzing FontAwesome icon usage...\n');
  
  const srcPath = path.resolve(__dirname, '../src');
  const iconUsages = scanForIconImports(srcPath);
  
  const iconUsageArray = Array.from(iconUsages.values());
  const totalIcons = iconUsageArray.length;
  const uniqueIcons = new Set(iconUsageArray.map(u => u.iconName)).size;
  const treeShakeableIcons = iconUsageArray.filter(u => u.isTreeShakeable).length;
  const nonTreeShakeableIcons = totalIcons - treeShakeableIcons;
  
  const analysis: IconAnalysis = {
    totalIcons,
    uniqueIcons,
    treeShakeableIcons,
    nonTreeShakeableIcons,
    iconUsages: iconUsageArray,
    recommendations: [],
    optimizationOpportunities: [],
  };
  
  // Generate recommendations
  generateIconRecommendations(analysis);
  
  return analysis;
}

function generateIconRecommendations(analysis: IconAnalysis): void {
  const { iconUsages, recommendations, optimizationOpportunities } = analysis;
  
  // Check for non-tree-shakeable imports
  const nonTreeShakeable = iconUsages.filter(u => !u.isTreeShakeable);
  if (nonTreeShakeable.length > 0) {
    recommendations.push('🌳 Convert to named imports for better tree-shaking:');
    for (const usage of nonTreeShakeable.slice(0, 5)) {
      recommendations.push(`   ❌ ${usage.iconName} in ${usage.files[0]}`);
      recommendations.push(`   ✅ Use: import { ${usage.iconName} } from '${usage.importPath}';`);
    }
    if (nonTreeShakeable.length > 5) {
      recommendations.push(`   ... and ${nonTreeShakeable.length - 5} more icons`);
    }
  }
  
  // Check for duplicate icons across different import paths
  const iconNameCounts = new Map<string, IconUsage[]>();
  for (const usage of iconUsages) {
    if (!iconNameCounts.has(usage.iconName)) {
      iconNameCounts.set(usage.iconName, []);
    }
    iconNameCounts.get(usage.iconName)!.push(usage);
  }
  
  const duplicateIcons = Array.from(iconNameCounts.entries()).filter(([_, usages]) => usages.length > 1);
  if (duplicateIcons.length > 0) {
    recommendations.push('🔄 Potential duplicate icon imports detected:');
    for (const [iconName, usages] of duplicateIcons.slice(0, 3)) {
      recommendations.push(`   ${iconName} imported from ${usages.length} different paths`);
      for (const usage of usages) {
        recommendations.push(`     - ${usage.importPath} in ${usage.files.length} files`);
      }
    }
  }
  
  // Check for frequently used icons that could be optimized
  const frequentIcons = iconUsages
    .filter(u => u.files.length > 3)
    .sort((a, b) => b.files.length - a.files.length);
  
  if (frequentIcons.length > 0) {
    optimizationOpportunities.push('📊 Frequently used icons (consider icon library optimization):');
    for (const usage of frequentIcons.slice(0, 5)) {
      optimizationOpportunities.push(`   ${usage.iconName}: used in ${usage.files.length} files`);
    }
  }
  
  // Bundle size optimization suggestions
  if (analysis.totalIcons > 20) {
    optimizationOpportunities.push('📦 Large number of icons detected. Consider:');
    optimizationOpportunities.push('   - Creating a custom icon library with only used icons');
    optimizationOpportunities.push('   - Using SVG sprites for frequently used icons');
    optimizationOpportunities.push('   - Implementing dynamic icon loading for rarely used icons');
  }
  
  // Tree-shaking effectiveness
  const treeShakingEffectiveness = (analysis.treeShakeableIcons / analysis.totalIcons) * 100;
  if (treeShakingEffectiveness < 80) {
    recommendations.push(`⚠️ Tree-shaking effectiveness: ${treeShakingEffectiveness.toFixed(1)}% (target: >80%)`);
    recommendations.push('   Focus on converting to named imports for better optimization.');
  } else {
    recommendations.push(`✅ Good tree-shaking effectiveness: ${treeShakingEffectiveness.toFixed(1)}%`);
  }
}

function printIconReport(analysis: IconAnalysis): void {
  console.log('🎯 FontAwesome Icon Usage Report\n');
  console.log('='.repeat(70));
  
  // Summary
  console.log('\n📊 Icon Usage Summary:');
  console.log('-'.repeat(40));
  console.log(`  Total icon imports: ${analysis.totalIcons}`);
  console.log(`  Unique icons: ${analysis.uniqueIcons}`);
  console.log(`  Tree-shakeable imports: ${analysis.treeShakeableIcons}`);
  console.log(`  Non-tree-shakeable imports: ${analysis.nonTreeShakeableIcons}`);
  
  const treeShakingEffectiveness = (analysis.treeShakeableIcons / analysis.totalIcons) * 100;
  console.log(`  Tree-shaking effectiveness: ${treeShakingEffectiveness.toFixed(1)}%`);
  
  // Most used icons
  if (analysis.iconUsages.length > 0) {
    console.log('\n🔥 Most Frequently Used Icons:');
    console.log('-'.repeat(40));
    const sortedByUsage = analysis.iconUsages
      .sort((a, b) => b.files.length - a.files.length)
      .slice(0, 10);
    
    for (const usage of sortedByUsage) {
      const status = usage.isTreeShakeable ? '✅' : '❌';
      console.log(`  ${status} ${usage.iconName}: ${usage.files.length} files`);
    }
  }
  
  // Import path breakdown
  const importPaths = new Map<string, number>();
  for (const usage of analysis.iconUsages) {
    importPaths.set(usage.importPath, (importPaths.get(usage.importPath) || 0) + 1);
  }
  
  if (importPaths.size > 0) {
    console.log('\n📦 Import Path Breakdown:');
    console.log('-'.repeat(40));
    for (const [path, count] of Array.from(importPaths.entries()).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${path}: ${count} icons`);
    }
  }
  
  // Recommendations
  if (analysis.recommendations.length > 0) {
    console.log('\n💡 Optimization Recommendations:');
    console.log('-'.repeat(40));
    for (const recommendation of analysis.recommendations) {
      console.log(`  ${recommendation}`);
    }
  }
  
  // Optimization opportunities
  if (analysis.optimizationOpportunities.length > 0) {
    console.log('\n🚀 Optimization Opportunities:');
    console.log('-'.repeat(40));
    for (const opportunity of analysis.optimizationOpportunities) {
      console.log(`  ${opportunity}`);
    }
  }
  
  console.log('\n' + '='.repeat(70));
  
  // Final status
  if (analysis.nonTreeShakeableIcons > 0) {
    console.log('\n⚠️ Icon analysis completed with optimization opportunities. See recommendations above.\n');
  } else {
    console.log('\n✅ Icon usage is optimally configured for tree-shaking.\n');
  }
}

// Generate optimization guide
function generateOptimizationGuide(): void {
  console.log('📚 Icon Optimization Best Practices:');
  console.log('-'.repeat(40));
  console.log('  1. ✅ Use named imports:');
  console.log('     import { faHome, faUser } from "@fortawesome/free-solid-svg-icons";');
  console.log('');
  console.log('  2. ❌ Avoid namespace imports:');
  console.log('     import * as Icons from "@fortawesome/free-solid-svg-icons"; // Bad');
  console.log('');
  console.log('  3. ✅ Import only what you need:');
  console.log('     import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";');
  console.log('     import { faCheck } from "@fortawesome/free-solid-svg-icons";');
  console.log('');
  console.log('  4. 🎯 Consider creating an icon registry for frequently used icons:');
  console.log('     // icons/registry.ts');
  console.log('     export const iconRegistry = { faHome, faUser, faCheck };');
  console.log('');
  console.log('  5. 📦 For component libraries, accept icons as props:');
  console.log('     interface ButtonProps { icon?: ReactNode; }');
  console.log('');
}

// Main execution
function main(): void {
  const analysis = analyzeIconUsage();
  printIconReport(analysis);
  generateOptimizationGuide();
  
  // Exit with warning code if there are optimization opportunities
  if (analysis.nonTreeShakeableIcons > 0) {
    process.exit(1);
  }
}

main();