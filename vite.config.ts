import { ConfigEnv, UserConfig, defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { GenerateManifest } from './manifestGenerator';
import path from 'path';
import sass from 'sass';
import { splitVendorChunkPlugin } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default ({ mode }: ConfigEnv): UserConfig => {
  const isProd = mode === 'production';
  const isDev = mode === 'development';

  return defineConfig({
    publicDir: 'public',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@contexts': path.resolve(__dirname, 'src/contexts'),
        '@api': path.resolve(__dirname, 'src/api'),
      },
    },
    assetsInclude: ['**/*.jpeg', '**/*.jpg', '**/*.svg', '**/*.png', '**/*.webp', '**/*.avif'],
    plugins: [
      react({
        babel: {
          plugins: [
            // Remove prop-types in production
            isProd && 'babel-plugin-transform-remove-console',
            isProd && ['babel-plugin-transform-remove-prop-types', { removeImport: true }],
          ].filter(Boolean),
        },
      }),
      tsconfigPaths(),
      splitVendorChunkPlugin(),
      {
        name: 'manifest-generator',
        enforce: 'post',
        writeBundle: GenerateManifest,
      },
      // Bundle analyzer for production builds
      isProd && visualizer({
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
        generateScopedName: isProd ? '[hash:base64:5]' : '[name]__[local]__[hash:base64:5]',
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: isDev ? true : 'hidden',
      minify: isProd ? 'terser' : false,
      target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
      cssTarget: 'chrome87',
      terserOptions: {
        compress: {
          drop_console: isProd,
          drop_debugger: isProd,
          pure_funcs: isProd ? ['console.log', 'console.info', 'console.debug', 'console.warn'] : [],
        },
        mangle: {
          safari10: true,
        },
      },
      rollupOptions: {
        output: {
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split('/').pop()
              : 'chunk';
            return `static/js/${facadeModuleId}-[hash].js`;
          },
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
          manualChunks: {
            // Vendor chunks for better caching
            react: ['react', 'react-dom'],
            router: ['react-router-dom'],
            utils: ['axios', '@tanstack/react-query'],
            ui: ['framer-motion', '@fortawesome/react-fontawesome'],
          },
        },
        external: [],
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
        },
      },
      // Chunk size warnings
      chunkSizeWarningLimit: 1000,
      reportCompressedSize: isProd,
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
    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'axios',
        '@tanstack/react-query',
        'framer-motion',
      ],
      exclude: ['@fortawesome/fontawesome-svg-core'],
    },
  });
};
