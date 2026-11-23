import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Tennis Gear: Tennis Equipment & Specifications',
        short_name: 'Tennis Gear',
        description: 'An installable tennis equipment catalog with detailed specifications.',
        theme_color: '#102521',
        background_color: '#f5f6f2',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,webp,ico,woff2}'],
        runtimeCaching: [
          {
            urlPattern: ({ url, request }) => request.method === 'GET' && url.pathname.startsWith('/api/products'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'tennis-gear-products-v1',
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 }
            }
          },
          {
            urlPattern: ({ url, request }) => request.method === 'GET' && url.pathname === '/api/categories',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'tennis-gear-categories-v1', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 } }
          }
        ]
      }
    })
  ],
  server: { host: '0.0.0.0', port: 5173, proxy: { '/api': { target: 'http://localhost:4000', changeOrigin: true } } },
  preview: { host: '0.0.0.0', port: 4173 }
});
