import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/thoughts-app/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate', // сервис воркер будет обновляться автоматически
      manifest: {
        name: 'Thoughts App',
        short_name: 'Thoughts',
        start_url: '/thoughts-app/',
        display: 'standalone', // чтобы выглядело как отдельное приложение
        background_color: '#0d0d0d',
        theme_color: '#0d0d0d',
        icons: [
          {
            src: '/thoughts-app/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/thoughts-app/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})