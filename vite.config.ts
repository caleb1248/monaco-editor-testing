import { defineConfig } from 'vite';
import importMetaUrlPlugin from '@codingame/esbuild-import-meta-url-plugin';

export default defineConfig({
  build: {
    target: 'esnext',
  },
  plugins: [
    {
      // For the *-language-features extensions which use SharedArrayBuffer
      name: 'configure-response-headers',
      apply: 'serve',
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
          res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
          next();
        });
      },
    },
  ],
  optimizeDeps: {
    esbuildOptions: {
      tsconfig: './tsconfig.json',
      plugins: [importMetaUrlPlugin],
    },
  },
});
