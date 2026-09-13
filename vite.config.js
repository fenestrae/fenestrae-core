import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

const peerDeps = [
  'react',
  'react-dom',
  'react-router-dom',
  'zustand',
  'immer',
  'uuid',
  'clsx',
  'prop-types',
  'react-icons',
];

const isPeerDep = (id) =>
  peerDeps.some((dep) => id === dep || id.startsWith(`${dep}/`));

const PURE_ANNOTATION_RE = /\/\*+\s*[@#]__PURE__\s*\*+\//g;

// jsxSideEffects stops PURE on jsx(). esbuild still emits it on new Map/Set/Date;
// Terser keeps those annotations and Vite 8/Rolldown warns.
function stripPureAnnotations() {
  return {
    name: 'strip-pure-annotations',
    generateBundle(_options, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type === 'chunk' && file.code.includes('__PURE__')) {
          file.code = file.code.replace(PURE_ANNOTATION_RE, '');
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    stripPureAnnotations(),
  ],

  esbuild: {
    jsxSideEffects: true,
  },

  build: {
    outDir: 'dist',
    // Terser evita las anotaciones PURE que esbuild inserta en el JSX
    minify: "terser",
    terserOptions: {
      compress: {
        defaults: true,
        pure_funcs: [], // evita anotaciones automáticas
      },
      format: {
        comments: false,
        preserve_annotations: false,
      },
    },

    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'Fenestrae',
      formats: ['es', 'cjs'],
      fileName: (format) => `fenestrae.${format}.js`,
    },

    rollupOptions: {
      // Incluye subpaths (react-dom/client, zustand/middleware, react-icons/md…)
      // Si no, Rollup los empaqueta y el bundle se dispara.
      external: isPeerDep,
      output: {
        exports: 'named',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-dom/client': 'ReactDOM',
          'react/jsx-runtime': 'JSXRuntime',
          'react-router-dom': 'ReactRouterDOM',
          zustand: 'zustand',
          'zustand/middleware': 'zustandMiddleware',
          'zustand/react/shallow': 'zustandShallow',
          immer: 'immer',
          uuid: 'uuid',
          clsx: 'clsx',
          'prop-types': 'PropTypes',
          'react-icons': 'ReactIcons',
          'react-icons/md': 'ReactIconsMd',
        }
      }
    }
  }
});
