import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    proxy: {
      '/bin/portauthority': {
        target: 'https://www.panynj.gov',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  preview: {
    port: 8080,
    host: true,
    allowedHosts: true,
  },
})
