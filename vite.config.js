// vue.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; // 引入path模块用于路径解析

// https://vitejs.dev/config/
export default defineConfig({
  base: '/kingstalent', // 设置为你的GitHub项目名称
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 将 '@' 设置为 'src' 目录的别名
    },
  },
  // build: {
  //   rollupOptions: {
  //     output: {
  //      manualChunks: () => 'everything.js' // 将所有模块打包成一个文件
  //    }
  //  }
  // },
});