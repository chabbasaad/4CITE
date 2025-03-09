import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import VitePluginEnvCompatible from 'vite-plugin-env-compatible';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePluginEnvCompatible(),
  ],
});
