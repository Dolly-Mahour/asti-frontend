import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'chart.js': path.resolve(import.meta.dirname, 'node_modules/chart.js'),
    },
    dedupe: ['chart.js'],
  },
  optimizeDeps: {
    include: ['chart.js', 'chartjs-plugin-datalabels', 'react-chartjs-2'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})