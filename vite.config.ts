import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

const externalizePlugin = () => ({
  name: 'externalize-plugin',
  enforce: 'pre' as const,
  resolveId(source) {
    if (
      source === 'three' || 
      source.startsWith('three/') || 
      source === 'xrblocks' || 
      source.startsWith('xrblocks/') ||
      source === 'troika-three-text' ||
      source === 'troika-three-utils' ||
      source === 'troika-worker-utils' ||
      source === 'bidi-js' ||
      source === 'webgl-sdf-generator' ||
      source === 'lit' ||
      source.startsWith('lit/') ||
      source === '@google/genai' ||
      source.startsWith('@pmndrs/') ||
      source === '@preact/signals-core' ||
      source.startsWith('yoga-layout') ||
      source === '@dimforge/rapier3d-simd-compat' ||
      source.startsWith('@dimforge/')
    ) {
      return { id: source, external: true };
    }
    return null;
  }
});

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), externalizePlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    optimizeDeps: {
      exclude: [
        'three',
        'xrblocks',
        'xrblocks/addons/simulator/SimulatorAddons.js',
        'troika-three-text',
        'troika-three-utils',
        'troika-worker-utils',
        'bidi-js',
        'webgl-sdf-generator',
        'lit',
        '@google/genai'
      ],
    },
    build: {
      rollupOptions: {
        external: [
          'three',
          'xrblocks',
          'xrblocks/addons/simulator/SimulatorAddons.js',
          /^three\/.*/,
          /^xrblocks\/.*/,
          /^@dimforge\/.*/,
          /^@pmndrs\/.*/
        ],
      },
    },
  };
});
