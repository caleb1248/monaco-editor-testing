import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import importMetaUrlPlugin from '@codingame/esbuild-import-meta-url-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'vscode/extensions',
      'vscode/services',
      'vscode/monaco',
      'vscode/localExtensionHost',
    ],
    esbuildOptions: {
      plugins: [importMetaUrlPlugin],
    },
  },
});
