import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [svelte()],
  test: {
    globals: true,
    environment: 'jsdom',  // Ensure you use jsdom environment for testing
  },
  resolve: {
    conditions: process.env.VITEST ? ['browser'] : undefined,  // Ensure conditions are handled properly
  },
  server: mode === 'development' ? {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxying request:', req.url)
          })
        }
      },
    },
  } : undefined,
}))
