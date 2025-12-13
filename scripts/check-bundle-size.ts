/**
 * Bundle Size Monitoring Script
 *
 * This script checks the CSS bundle size after a production build
 * and warns if it exceeds the target threshold (100KB gzipped).
 *
 * Requirements Validated:
 * - 9.4: CSS size optimization (< 100KB gzipped target)
 *
 * Usage:
 *   pnpm run check-bundle-size
 *
 * The script will:
 * 1. Read all CSS files from dist/static/css
 * 2. Calculate total uncompressed and estimated gzipped sizes
 * 3. Warn if the gzipped size exceeds 100KB
 * 4. Output a summary of CSS bundle sizes
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

// ES Module compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CSS_SIZE_LIMIT_KB = 100; // 100KB gzipped target (Requirement 9.4)
const DIST_CSS_PATH = path.resolve(__dirname, '../dist/static/css');

interface BundleSizeResult {
  file: string;
  uncompressedSize: number;
  gzippedSize: number;
}

interface BundleSizeSummary {
  files: BundleSizeResult[];
  totalUncompressed: number;
  totalGzipped: number;
  exceedsLimit: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(2)} KB`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

function checkBundleSize(): BundleSizeSummary {
  if (!fs.existsSync(DIST_CSS_PATH)) {
    console.error('❌ dist/static/css folder not found. Run `pnpm build` first.');
    process.exit(1);
  }

  const cssFiles = fs.readdirSync(DIST_CSS_PATH).filter((f) => f.endsWith('.css'));

  if (cssFiles.length === 0) {
    console.error('❌ No CSS files found in dist/static/css');
    process.exit(1);
  }

  const results: BundleSizeResult[] = [];
  let totalUncompressed = 0;
  let totalGzipped = 0;

  for (const file of cssFiles) {
    const filePath = path.join(DIST_CSS_PATH, file);
    const content = fs.readFileSync(filePath);
    const gzipped = gzipSync(content);

    const result: BundleSizeResult = {
      file,
      uncompressedSize: content.length,
      gzippedSize: gzipped.length,
    };

    results.push(result);
    totalUncompressed += content.length;
    totalGzipped += gzipped.length;
  }

  // Sort by gzipped size (largest first)
  results.sort((a, b) => b.gzippedSize - a.gzippedSize);

  return {
    files: results,
    totalUncompressed,
    totalGzipped,
    exceedsLimit: totalGzipped / 1024 > CSS_SIZE_LIMIT_KB,
  };
}

function printSummary(summary: BundleSizeSummary): void {
  console.log('\n📦 CSS Bundle Size Report\n');
  console.log('='.repeat(60));

  // Print individual files (top 10 largest)
  console.log('\nTop CSS files by size (gzipped):');
  console.log('-'.repeat(60));

  const topFiles = summary.files.slice(0, 10);
  for (const file of topFiles) {
    const uncompressed = formatBytes(file.uncompressedSize);
    const gzipped = formatBytes(file.gzippedSize);
    console.log(`  ${file.file}`);
    console.log(`    Uncompressed: ${uncompressed} | Gzipped: ${gzipped}`);
  }

  if (summary.files.length > 10) {
    console.log(`  ... and ${summary.files.length - 10} more files`);
  }

  // Print totals
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Summary:');
  console.log(`  Total CSS files: ${summary.files.length}`);
  console.log(`  Total uncompressed: ${formatBytes(summary.totalUncompressed)}`);
  console.log(`  Total gzipped: ${formatBytes(summary.totalGzipped)}`);
  console.log(`  Target limit: ${CSS_SIZE_LIMIT_KB} KB gzipped`);

  // Status
  console.log('\n' + '='.repeat(60));
  if (summary.exceedsLimit) {
    console.log(
      `\n⚠️  WARNING: CSS bundle size (${formatBytes(summary.totalGzipped)}) exceeds ${CSS_SIZE_LIMIT_KB}KB limit!`,
    );
    console.log('   Consider:');
    console.log('   - Removing unused styles');
    console.log('   - Using more specific CSS selectors');
    console.log('   - Splitting large CSS files');
    console.log('   - Reviewing design token usage\n');
  } else {
    console.log(
      `\n✅ CSS bundle size (${formatBytes(summary.totalGzipped)}) is within the ${CSS_SIZE_LIMIT_KB}KB limit.\n`,
    );
  }
}

// Main execution
const summary = checkBundleSize();
printSummary(summary);

// Exit with error code if limit exceeded
if (summary.exceedsLimit) {
  process.exit(1);
}
