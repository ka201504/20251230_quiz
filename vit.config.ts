import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Vercel上の環境変数をブラウザのコード（process.env.API_KEY）にマッピングします
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
});