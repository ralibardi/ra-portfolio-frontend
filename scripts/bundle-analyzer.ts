/**
 * Bundle Size Analysis Script
 *
 * This script analyzes the production build bundle to identify optimization
 * opportunities and ensure tree-shaking is working effectively.
 *
 * Requirements Validated:
 * - Task 18.1: Bundle size optimization
 * - Tree-shaking effectiveness
 * - Code splitting analysis
 *
 * Usage:
 *   pnpm run analyze-bundle
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

// ES Module compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface BundleFile {
  name: string;
  size: number;
  gzippedSize: number;
  type: 'js' | 'css' | 'other';
}

interface BundleAnalysis {
  totalFiles: number;
  totalSize: number;
  totalGzippedSize: number;
  jsFiles: BundleFile[];
  cssFiles: BundleFile[];
  largestFiles: BundleFile[];
  recommendations: string[];
}

// Bundle size thresholds (in KB)
const THRESHOLDS = {
  JS_CHUNK_WARNING: 250, // Warn if JS chunk > 250KB
  JS_CHUNK_ERROR: 500,   // Error if JS chunk > 500KB
  CSS_TOTAL_WARNING: 50, // Warn if total CSS > 50KB gzipped
  CSS_TOTAL_ERROR: 100,  // Error if total CSS > 100KB gzipped
  MAIN_BUNDLE_WARNING: 150, // Warn if main bundle > 150KB gzipped
  MAIN_BUNDLE_ERROR: 300,   // Error if main bundle > 300KB gzipped
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

function getFileType(filename: string): 'js' | 'css' | 'other' {
  if (filename.endsWith('.js')) return 'js';
  if (filename.endsWith('.css')) return 'css';
  return 'other';
}

function analyzeBundleFiles(distPath: string): BundleFile[] {
  const files: BundleFile[] = [];
  
  function scanDirectory(dirPath: string) {
    if (!fs.existsSync(dirPath)) return;
    
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        scanDirectory(fullPath);
      } else if (entry.isFile() && !entry.name.endsWith('.map')) {
        const content = fs.readFileSync(fullPath);
        const gzipped = gzipSync(content);
        
        files.push({
          name: entry.name,
          size: content.length,
          gzippedSize: gzipped.length,
          type: getFileType(entry.name),
        });
      }
    }
  }
  
  scanDirectory(distPath);
  return files;
}

function generateRecommendations(analysis: BundleAnalysis): string[] {
  const recommendations: string[] = [];
  
  // Check main bundle size
  const mainBundle = analysis.jsFiles.find(f => f.name.includes('index-') && f.size > 100000);
  if (mainBundle) {
    const gzippedKB = mainBundle.gzippedSize / 1024;
    if (gzippedKB > THRESHOLDS.MAIN_BUNDLE_ERROR) {
      recommendations.push(`🚨 Main bundle (${formatBytes(mainBundle.gzippedSize)}) exceeds ${THRESHOLDS.MAIN_BUNDLE_ERROR}KB limit`);
      recommendations.push('   Consider: Code splitting, lazy loading, removing unused dependencies');
    } else if (gzippedKB > THRESHOLDS.MAIN_BUNDLE_WARNING) {
      recommendations.push(`⚠️  Main bundle (${formatBytes(mainBundle.gzippedSize)}) approaching size limit`);
      recommendations.push('   Consider: Analyzing bundle composition with webpack-bundle-analyzer');
    }
  }
  
  // Check for large JS chunks
  const largeJsChunks = analysis.jsFiles.filter(f => f.gzippedSize / 1024 > THRESHOLDS.JS_CHUNK_WARNING);
  if (largeJsChunks.length > 0) {
    recommendations.push(`📦 Found ${largeJsChunks.length} large JS chunks:`);
    largeJsChunks.forEach(chunk => {
      recommendations.push(`   - ${chunk.name}: ${formatBytes(chunk.gzippedSize)}`);
    });
    recommendations.push('   Consider: Dynamic imports, code splitting, tree-shaking optimization');
  }
  
  // Check total CSS size
  const totalCssGzipped = analysis.cssFiles.reduce((sum, f) => sum + f.gzippedSize, 0);
  const cssKB = totalCssGzipped / 1024;
  if (cssKB > THRESHOLDS.CSS_TOTAL_ERROR) {
    recommendations.push(`🚨 Total CSS (${formatBytes(totalCssGzipped)}) exceeds ${THRESHOLDS.CSS_TOTAL_ERROR}KB limit`);
    recommendations.push('   Consider: Removing unused styles, CSS purging, design token optimization');
  } else if (cssKB > THRESHOLDS.CSS_TOTAL_WARNING) {
    recommendations.push(`⚠️  Total CSS (${formatBytes(totalCssGzipped)}) approaching size limit`);
  }
  
  // Check for duplicate dependencies (heuristic)
  const jsFileNames = analysis.jsFiles.map(f => f.name);
  const possibleDuplicates = jsFileNames.filter(name => 
    jsFileNames.some(other => other !== name && other.includes(name.split('-')[0]))
  );
  if (possibleDuplicates.length > 0) {
    recommendations.push('🔍 Possible duplicate dependencies detected:');
    possibleDuplicates.forEach(name => {
      recommendations.push(`   - ${name}`);
    });
    recommendations.push('   Consider: Checking for duplicate packages in bundle');
  }
  
  // Tree-shaking effectiveness
  const totalJsSize = analysis.jsFiles.reduce((sum, f) => sum + f.size, 0);
  const avgChunkSize = totalJsSize / analysis.jsFiles.length;
  if (avgChunkSize > 50000) { // 50KB average
    recommendations.push('🌳 Tree-shaking may not be optimal:');
    recommendations.push('   Consider: Reviewing import patterns, using named imports, checking sideEffects');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('✅ Bundle size is well optimized!');
    recommendations.push('✅ No major optimization opportunities detected');
  }
  
  return recommendations;
}

function printAnalysis(analysis: BundleAnalysis): void {
  console.log('\n📦 Bundle Size Analysis Report\n');
  console.log('='.repeat(70));
  
  // Summary
  console.log('\n📊 Bundle Summary:');
  console.log('-'.repeat(40));
  console.log(`  Total files: ${analysis.totalFiles}`);
  console.log(`  Total size: ${formatBytes(analysis.totalSize)} (uncompressed)`);
  console.log(`  Total size: ${formatBytes(analysis.totalGzippedSize)} (gzipped)`);
  console.log(`  JavaScript files: ${analysis.jsFiles.length}`);
  console.log(`  CSS files: ${analysis.cssFiles.length}`);
  
  // Largest files
  console.log('\n🔍 Largest Files (Top 10):');
  console.log('-'.repeat(40));
  analysis.largestFiles.slice(0, 10).forEach((file, index) => {
    const icon = file.type === 'js' ? '📜' : file.type === 'css' ? '🎨' : '📄';
    console.log(`  ${index + 1}. ${icon} ${file.name}`);
    console.log(`     Uncompressed: ${formatBytes(file.size)} | Gzipped: ${formatBytes(file.gzippedSize)}`);
  });
  
  // JavaScript analysis
  if (analysis.jsFiles.length > 0) {
    console.log('\n📜 JavaScript Bundle Analysis:');
    console.log('-'.repeat(40));
    const totalJsGzipped = analysis.jsFiles.reduce((sum, f) => sum + f.gzippedSize, 0);
    console.log(`  Total JS size: ${formatBytes(totalJsGzipped)} (gzipped)`);
    console.log(`  Number of chunks: ${analysis.jsFiles.length}`);
    console.log(`  Average chunk size: ${formatBytes(totalJsGzipped / analysis.jsFiles.length)} (gzipped)`);
    
    // Show largest JS files
    const largestJs = analysis.jsFiles
      .sort((a, b) => b.gzippedSize - a.gzippedSize)
      .slice(0, 5);
    
    console.log('\n  Largest JS chunks:');
    largestJs.forEach((file, index) => {
      console.log(`    ${index + 1}. ${file.name}: ${formatBytes(file.gzippedSize)}`);
    });
  }
  
  // CSS analysis
  if (analysis.cssFiles.length > 0) {
    console.log('\n🎨 CSS Bundle Analysis:');
    console.log('-'.repeat(40));
    const totalCssGzipped = analysis.cssFiles.reduce((sum, f) => sum + f.gzippedSize, 0);
    console.log(`  Total CSS size: ${formatBytes(totalCssGzipped)} (gzipped)`);
    console.log(`  Number of CSS files: ${analysis.cssFiles.length}`);
    console.log(`  Average CSS file size: ${formatBytes(totalCssGzipped / analysis.cssFiles.length)} (gzipped)`);
  }
  
  // Recommendations
  console.log('\n💡 Optimization Recommendations:');
  console.log('-'.repeat(40));
  analysis.recommendations.forEach(rec => {
    console.log(`  ${rec}`);
  });
  
  console.log('\n' + '='.repeat(70));
  console.log('\n🚀 Bundle Analysis Complete!\n');
}

// Main execution
function main(): void {
  const distPath = path.resolve(__dirname, '../dist');
  
  if (!fs.existsSync(distPath)) {
    console.error('❌ dist folder not found. Run `pnpm build` first.');
    process.exit(1);
  }
  
  console.log('🔍 Analyzing production bundle...');
  
  const files = analyzeBundleFiles(distPath);
  
  if (files.length === 0) {
    console.error('❌ No files found in dist folder.');
    process.exit(1);
  }
  
  const jsFiles = files.filter(f => f.type === 'js');
  const cssFiles = files.filter(f => f.type === 'css');
  const largestFiles = files.sort((a, b) => b.gzippedSize - a.gzippedSize);
  
  const analysis: BundleAnalysis = {
    totalFiles: files.length,
    totalSize: files.reduce((sum, f) => sum + f.size, 0),
    totalGzippedSize: files.reduce((sum, f) => sum + f.gzippedSize, 0),
    jsFiles,
    cssFiles,
    largestFiles,
    recommendations: [],
  };
  
  analysis.recommendations = generateRecommendations(analysis);
  
  printAnalysis(analysis);
  
  // Exit with error if critical issues found
  const hasCriticalIssues = analysis.recommendations.some(rec => rec.includes('🚨'));
  if (hasCriticalIssues) {
    console.log('❌ Critical bundle size issues detected!');
    process.exit(1);
  }
}

main();