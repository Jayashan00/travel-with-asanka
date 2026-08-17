import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // keeps uploaded images working in development without extra config
      '/uploads': 'http://localhost:8080',
    },
  },
})
