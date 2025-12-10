/**
 * Vite Configuration - Modern Web Performance Best Practices
 *
 * Chunking Strategy:
 * - Automatic intelligent chunking (no manual configuration needed)
 * - Vite automatically splits vendor code from application code
 * - Dynamic imports create separate chunks for route-based code splitting
 * - No empty chunks - only creates chunks with meaningful content
 *
 * Performance Optimizations:
 * - 500KB chunk size limit (industry best practice)
 * - CSS code splitting for better caching
 * - Aggressive tree shaking to remove unused code
 * - Asset inlining for small files (<4KB)
 * - Modern compression and minification
 * - Optimized for HTTP/2 multiplexing
 */
import { ConfigEnv, UserConfig, defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';
import { GenerateManifest } from './manifestGenerator';
import path from 'path';
import sass from 'sass';

import { visualizer } from 'rollup-plugin-visualizer';

export default ({ mode }: ConfigEnv): UserConfig => {
  const isProd = mode === 'production';
  const isDev = mode === 'development';

  return defineConfig({
    publicDir: 'public',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@app': path.resolve(__dirname, 'src/app'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@contexts': path.resolve(__dirname, 'src/contexts'),
        '@api': path.resolve(__dirname, 'src/api'),
      },
    },
    assetsInclude: [
      '**/*.jpeg',
      '**/*.jpg',
      '**/*.svg',
      '**/*.png',
      '**/*.webp',
      '**/*.avif',
    ],
    plugins: [
      react({
        babel: {
          plugins: isProd ? ['babel-plugin-transform-remove-console'] : [],
        },
      }),
      tsconfigPaths(),

      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,avif}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
              },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
              },
            },
          ],
        },
        includeAssets: ['favicon.ico', 'appLogo.svg', 'robots.txt'],
        manifest: {
          name: 'Ronny Alibardi Portfolio',
          short_name: 'RA Portfolio',
          description:
            'Portfolio showcasing the work and projects of Ronny Alibardi',
          theme_color: '#ffffff',
          background_color: '#fdfdfd',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: 'icons/android/android-launchericon-192-192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'icons/android/android-launchericon-512-512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
      {
        name: 'manifest-generator',
        enforce: 'post',
        writeBundle: GenerateManifest,
      },
      // Bundle analyzer for production builds
      isProd &&
        visualizer({
          filename: 'dist/stats.html',
          open: false,
          gzipSize: true,
          brotliSize: true,
        }),
    ].filter(Boolean),
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          implementation: sass,
        },
      },
      // CSS code splitting and optimization
      modules: {
        generateScopedName: isProd
          ? '[hash:base64:5]'
          : '[name]__[local]__[hash:base64:5]',
      },
      // Modern CSS optimization
      devSourcemap: isDev,
      postcss: {
        plugins: [],
      },
    },
    build: {
      // Simplified build configuration - uses Vite's intelligent defaults
      outDir: 'dist',
      sourcemap: isDev ? true : 'hidden',
      minify: isProd ? 'terser' : false,
      target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
      cssTarget: 'chrome87',
      terserOptions: {
        compress: {
          drop_console: isProd,
          drop_debugger: isProd,
          pure_funcs: isProd
            ? ['console.log', 'console.info', 'console.debug', 'console.warn']
            : [],
        },
        mangle: {
          safari10: true,
        },
      },
      rollupOptions: {
        output: {
          // Modern chunking strategy following web performance best practices
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') ?? [];
            let extType = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'images';
            } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
              extType = 'fonts';
            }
            return `static/${extType}/[name]-[hash][extname]`;
          },

          // Modern best practice: Let Vite handle chunking automatically
          // This prevents empty chunks and optimizes based on actual usage
        },

        // Modern tree shaking configuration for optimal bundle size
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
          // Additional optimizations
          preset: 'smallest',
        },
      },
      // Modern performance optimizations
      chunkSizeWarningLimit: 500, // Best practice: warn for chunks > 500KB
      reportCompressedSize: isProd,

      // Production-specific optimizations
      ...(isProd && {
        cssCodeSplit: true, // Split CSS into separate files for better caching
        assetsInlineLimit: 4096, // Inline assets < 4KB (best practice)
      }),
    },
    server: {
      port: 3000,
      open: true,
      cors: true,
      host: true,
    },
    preview: {
      port: 4173,
      host: true,
    },
    // Modern dependency optimization
    optimizeDeps: {
      // Pre-bundle these dependencies for faster dev server startup
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'axios',
        '@tanstack/react-query',
        'framer-motion',
        'i18next',
        'react-i18next',
      ],
      // Exclude problematic packages that should be handled by Vite
      exclude: ['@fortawesome/fontawesome-svg-core'],
      // Modern optimization settings
      force: false, // Only re-optimize when dependencies change
      esbuildOptions: {
        target: 'es2020', // Modern target for better optimization
      },
    },
  });
};
