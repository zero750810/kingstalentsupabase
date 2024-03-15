// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // 引入 Vuex store
// 在 src/main.js 中
import 'bootstrap/dist/css/bootstrap.min.css';
// 在 src/main.js 中
import 'bootstrap';
import { Modal } from 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;



createApp(App)
  .use(router)
  .use(store) // 使用 Vuex store
  .mount('#app');