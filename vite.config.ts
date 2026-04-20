/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // 🌟 AQUI ESTÁ A MÁGICA: Configuração do Servidor Vite
  server: {
    port: 3000, // Garante que vai rodar na porta 3000
    cors: true, // Libera o CORS
    headers: {
      "Access-Control-Allow-Origin": "*", // Diz ao navegador que qualquer "loja" pode acessar
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});