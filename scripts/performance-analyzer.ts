/**
 * Performance Optimization Analyzer
 *
 * This script analyzes React components for performance optimization opportunities
 * including memo usage, useCallback optimization, and re-render prevention.
 *
 * Requirements Validated:
 * - Task 18.2: Runtime performance optimization
 * - React.memo usage analysis
 * - useCallback optimization analysis
 * - Component re-render analysis
 *
 * Usage:
 *   pnpm run analyze-performance
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

// ES Module compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ComponentAnalysis {
  name: string;
  filePath: string;
  hasMemo: boolean;
  hasUseCallback: boolean;
  hasUseMemo: boolean;
  eventHandlers: string[];
  propsCount: number;
  complexityScore: number;
  recommendations: string[];
}

interface PerformanceReport {
  totalComponents: number;
  memoizedComponents: number;
  optimizedComponents: number;
  components: ComponentAnalysis[];
  overallRecommendations: string[];
}

function analyzeComponentFile(filePath: string, relativePath: string): ComponentAnalysis | null {
  if (!fs.existsSync(filePath) || !filePath.endsWith('.tsx')) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  // Extract component name from file path
  const fileName = path.basename(filePath, '.tsx');
  const componentName = fileName.charAt(0).toUpperCase() + fileName.slice(1);

  // Skip test files and story files
  if (fileName.includes('.test') || fileName.includes('.stories')) {
    return null;
  }

  // Check if this is a component file (has React component)
  const hasReactComponent = content.includes('function ' + componentName) || 
                           content.includes('const ' + componentName) ||
                           content.includes('export default') ||
                           content.includes('export const');

  if (!hasReactComponent) {
    return null;
  }

  // Analyze performance optimizations
  const hasMemo = content.includes('memo(') || content.includes('React.memo(');
  const hasUseCallback = content.includes('useCallback');
  const hasUseMemo = content.includes('useMemo');

  // Find event handlers
  const eventHandlers: string[] = [];
  const eventHandlerPatterns = [
    /on[A-Z]\w*\s*[:=]/g,
    /handle[A-Z]\w*\s*=/g,
    /onClick|onSubmit|onChange|onFocus|onBlur|onKeyDown|onKeyUp|onMouseEnter|onMouseLeave/g
  ];

  eventHandlerPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      eventHandlers.push(...matches.map(match => match.replace(/\s*[:=].*/, '')));
    }
  });

  // Count props (rough estimate)
  const propsMatches = content.match(/\w+\s*[?:]?\s*[^,}]+[,}]/g);
  const propsCount = propsMatches ? propsMatches.length : 0;

  // Calculate complexity score
  let complexityScore = 0;
  complexityScore += (content.match(/useState/g) || []).length * 2;
  complexityScore += (content.match(/useEffect/g) || []).length * 3;
  complexityScore += (content.match(/useCallback/g) || []).length * 1;
  complexityScore += (content.match(/useMemo/g) || []).length * 1;
  complexityScore += eventHandlers.length * 2;
  complexityScore += propsCount;

  // Generate recommendations
  const recommendations: string[] = [];

  if (!hasMemo && complexityScore > 10) {
    recommendations.push('Consider wrapping with React.memo() for better re-render performance');
  }

  if (eventHandlers.length > 0 && !hasUseCallback) {
    recommendations.push('Consider using useCallback for event handlers to prevent child re-renders');
  }

  if (propsCount > 5 && !hasUseMemo) {
    recommendations.push('Consider using useMemo for expensive computations or derived state');
  }

  if (content.includes('useState') && !hasUseCallback) {
    recommendations.push('State updates may cause unnecessary re-renders - consider useCallback for handlers');
  }

  // Check for inline functions in JSX
  const hasInlineFunctions = content.includes('onClick={() =>') || 
                            content.includes('onChange={() =>') ||
                            content.includes('onSubmit={() =>');
  
  if (hasInlineFunctions) {
    recommendations.push('Avoid inline functions in JSX - extract to useCallback hooks');
  }

  // Check for object/array literals in JSX
  const hasInlineObjects = content.includes('style={{') || 
                          content.includes('className={[') ||
                          content.includes('props={{');
  
  if (hasInlineObjects) {
    recommendations.push('Avoid inline objects/arrays in JSX - extract to useMemo or constants');
  }

  return {
    name: componentName,
    filePath: relativePath,
    hasMemo,
    hasUseCallback,
    hasUseMemo,
    eventHandlers: [...new Set(eventHandlers)], // Remove duplicates
    propsCount,
    complexityScore,
    recommendations,
  };
}

function scanComponentsDirectory(dirPath: string, basePath: string = ''): ComponentAnalysis[] {
  const components: ComponentAnalysis[] = [];
  
  if (!fs.existsSync(dirPath)) {
    return components;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.join(basePath, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules and other non-component directories
      if (!entry.name.startsWith('.') && 
          entry.name !== 'node_modules' && 
          entry.name !== 'dist' &&
          entry.name !== 'assets') {
        components.push(...scanComponentsDirectory(fullPath, relativePath));
      }
    } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
      const analysis = analyzeComponentFile(fullPath, relativePath);
      if (analysis) {
        components.push(analysis);
      }
    }
  }
  
  return components;
}

function generateOverallRecommendations(components: ComponentAnalysis[]): string[] {
  const recommendations: string[] = [];
  
  const totalComponents = components.length;
  const memoizedComponents = components.filter(c => c.hasMemo).length;
  const optimizedComponents = components.filter(c => c.hasUseCallback && c.hasUseMemo).length;
  
  const memoPercentage = (memoizedComponents / totalComponents) * 100;
  const optimizedPercentage = (optimizedComponents / totalComponents) * 100;
  
  if (memoPercentage < 80) {
    recommendations.push(`📊 Only ${memoPercentage.toFixed(1)}% of components use React.memo - consider memoizing frequently rendered components`);
  }
  
  if (optimizedPercentage < 60) {
    recommendations.push(`⚡ Only ${optimizedPercentage.toFixed(1)}% of components are fully optimized with useCallback/useMemo`);
  }
  
  // Find components with high complexity but low optimization
  const highComplexityComponents = components.filter(c => c.complexityScore > 15 && !c.hasMemo);
  if (highComplexityComponents.length > 0) {
    recommendations.push(`🔥 ${highComplexityComponents.length} high-complexity components could benefit from React.memo:`);
    highComplexityComponents.forEach(c => {
      recommendations.push(`   - ${c.name} (complexity: ${c.complexityScore})`);
    });
  }
  
  // Find components with many event handlers but no useCallback
  const eventHeavyComponents = components.filter(c => c.eventHandlers.length > 3 && !c.hasUseCallback);
  if (eventHeavyComponents.length > 0) {
    recommendations.push(`🎯 ${eventHeavyComponents.length} components with many event handlers should use useCallback:`);
    eventHeavyComponents.forEach(c => {
      recommendations.push(`   - ${c.name} (${c.eventHandlers.length} handlers)`);
    });
  }
  
  if (recommendations.length === 0) {
    recommendations.push('✅ All components are well-optimized for performance!');
    recommendations.push('✅ Good use of React.memo, useCallback, and useMemo');
  }
  
  return recommendations;
}

function printReport(report: PerformanceReport): void {
  console.log('\n⚡ React Performance Analysis Report\n');
  console.log('='.repeat(70));
  
  // Summary
  console.log('\n📊 Performance Summary:');
  console.log('-'.repeat(40));
  console.log(`  Total components analyzed: ${report.totalComponents}`);
  console.log(`  Components using React.memo: ${report.memoizedComponents} (${((report.memoizedComponents / report.totalComponents) * 100).toFixed(1)}%)`);
  console.log(`  Fully optimized components: ${report.optimizedComponents} (${((report.optimizedComponents / report.totalComponents) * 100).toFixed(1)}%)`);
  
  // Top components by complexity
  const sortedByComplexity = [...report.components].sort((a, b) => b.complexityScore - a.complexityScore);
  console.log('\n🔥 Most Complex Components (Top 10):');
  console.log('-'.repeat(40));
  sortedByComplexity.slice(0, 10).forEach((component, index) => {
    const memoIcon = component.hasMemo ? '✅' : '❌';
    const callbackIcon = component.hasUseCallback ? '✅' : '❌';
    const memoIcon2 = component.hasUseMemo ? '✅' : '❌';
    
    console.log(`  ${index + 1}. ${component.name} (complexity: ${component.complexityScore})`);
    console.log(`     memo: ${memoIcon} | useCallback: ${callbackIcon} | useMemo: ${memoIcon2}`);
    console.log(`     Props: ${component.propsCount} | Handlers: ${component.eventHandlers.length}`);
    
    if (component.recommendations.length > 0) {
      console.log(`     Recommendations: ${component.recommendations.length}`);
    }
  });
  
  // Components needing optimization
  const needsOptimization = report.components.filter(c => c.recommendations.length > 0);
  if (needsOptimization.length > 0) {
    console.log('\n🎯 Components Needing Optimization:');
    console.log('-'.repeat(40));
    needsOptimization.forEach(component => {
      console.log(`  📦 ${component.name}:`);
      component.recommendations.forEach(rec => {
        console.log(`     • ${rec}`);
      });
    });
  }
  
  // Overall recommendations
  console.log('\n💡 Overall Recommendations:');
  console.log('-'.repeat(40));
  report.overallRecommendations.forEach(rec => {
    console.log(`  ${rec}`);
  });
  
  console.log('\n📚 Performance Best Practices:');
  console.log('-'.repeat(40));
  console.log('  1. ✅ Use React.memo for components that render frequently');
  console.log('  2. ✅ Use useCallback for event handlers passed to children');
  console.log('  3. ✅ Use useMemo for expensive calculations or derived state');
  console.log('  4. ❌ Avoid inline functions and objects in JSX');
  console.log('  5. ❌ Avoid creating new objects/arrays on every render');
  console.log('  6. 🎯 Profile with React DevTools to identify actual bottlenecks');
  
  console.log('\n' + '='.repeat(70));
  console.log('\n🚀 Performance Analysis Complete!\n');
}

// Main execution
function main(): void {
  console.log('⚡ Analyzing React component performance...');
  
  const componentsPath = path.resolve(__dirname, '../src/lib/components');
  const components = scanComponentsDirectory(componentsPath, 'src/lib/components');
  
  if (components.length === 0) {
    console.error('❌ No components found to analyze.');
    process.exit(1);
  }
  
  const memoizedComponents = components.filter(c => c.hasMemo).length;
  const optimizedComponents = components.filter(c => c.hasUseCallback && c.hasUseMemo).length;
  
  const report: PerformanceReport = {
    totalComponents: components.length,
    memoizedComponents,
    optimizedComponents,
    components,
    overallRecommendations: generateOverallRecommendations(components),
  };
  
  printReport(report);
  
  // Exit with warning if many components need optimization
  const needsOptimization = components.filter(c => c.recommendations.length > 0).length;
  const optimizationPercentage = (needsOptimization / components.length) * 100;
  
  if (optimizationPercentage > 30) {
    console.log('⚠️  Many components could benefit from performance optimization.');
    process.exit(1);
  }
}

main();