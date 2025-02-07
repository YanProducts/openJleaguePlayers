import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    // viteが自分で判断できるが一応記入する
    base: process.env.APP_ENV === 'production' ? '/build/' : "/",
    plugins: [
        laravel({
            input: ['resources/js/app.jsx', 'resources/css/app.css'],
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
        host: "0.0.0.0",
        port: 5173, // 通常のViteサーバーのポートを指定
        proxy: {
            '/api': 'http://localhost:8000', // Laravelバックエンドへのプロキシ設定
        },
    },

    // 本番用
    build: {
        outDir: 'public/build', // ← このフォルダが参照される
        emptyOutDir: true, // ビルド前にフォルダをクリア
    },

});
