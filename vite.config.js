import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/users': {
        target: 'http://[::1]:4001',
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/users/, '/api/users')
      },
    }
  }
})
