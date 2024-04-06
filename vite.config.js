import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    optimizeDeps: {
        exclude: ['fsevents']
    },
    css: {
        preprocessorOptions: {
          sass: {
            additionalData: `$primary-color: #ff0000;`
          }
        }
    },
    server: {
        port: 5173, // 通常のViteサーバーのポートを指定
        proxy: {
          '/api': 'http://localhost:8000', // Laravelバックエンドへのプロキシ設定
        },
    },
});
