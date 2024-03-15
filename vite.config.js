import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; // 引入path模块用于路径解析

// https://vitejs.dev/config/
export default defineConfig({
  base: '/kingstalentsupabase/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 将 '@' 设置为 'src' 目录的别名
    },
  },
});
