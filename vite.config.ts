import { ConfigEnv, UserConfig, defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { GenerateManifest } from './manifestGenerator';
import path from 'path';
import sass from 'sass';

export default ({ mode }: ConfigEnv): UserConfig => {
  const isProd = mode === 'production';

  return defineConfig({
    publicDir: 'public',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@assets': path.resolve(__dirname, 'src/assets'),
      },
    },
    assetsInclude: ['**/*.jpeg', '**/*.jpg', '**/*.svg', '**/*.png'],
    plugins: [
      react(),
      tsconfigPaths(),
      {
        name: 'manifest-generator',
        enforce: 'post',
        writeBundle: GenerateManifest,
      },
    ],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          implementation: sass,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      terserOptions: {
        compress: {
          drop_console: isProd,
          drop_debugger: isProd,
        },
      },
      ...(isProd && {
        rollupOptions: {
          output: {
            chunkFileNames: 'static/js/[name]-[hash].js',
            entryFileNames: 'static/js/[name]-[hash].js',
            assetFileNames: 'static/assets/[name]-[hash].[ext]',
          },
        },
      }),
    },
  });
};
