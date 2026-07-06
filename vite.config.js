import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; 
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(), 
    react()
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'Fenestrae',
      formats: ['es', 'cjs'],
      fileName: (format) => `fenestrae.${format}.js`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react-router-dom',
        'zustand',
        'immer',
        'uuid',
        'idb-keyval',
        'clsx',
        'prop-types',
        'react-icons'
      ],
      output: {
        exports: 'named',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'JSXRuntime',
          'react-router-dom': 'ReactRouterDOM',
          zustand: 'zustand',
          immer: 'immer',
          uuid: 'uuid',
          'idb-keyval': 'idbKeyval',
          clsx: 'clsx',
          'prop-types': 'PropTypes',
          'react-icons': 'ReactIcons'
        }
      }
    }
  }
});