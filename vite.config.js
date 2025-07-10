import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  plugins: [
    react(),
    imagetools()
  ],
  // （可选）调整服务器端口、别名等
  server: {
    port: 3000
  }
});
