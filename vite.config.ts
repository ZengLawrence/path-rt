import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/bin/portauthority': {
        target: 'https://www.panynj.gov',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
