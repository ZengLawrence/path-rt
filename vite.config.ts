import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl(),
  ],
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
