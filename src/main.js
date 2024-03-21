// src/main.js
import { createApp } from './vue';
import App from './App.vue';
import router from './router';
import store from './store'; // 引入 Vuex store
// 在 src/main.js 中
import './bootstrap/dist/css/bootstrap.min.css';
// 在 src/main.js 中
import './bootstrap';
import './bootstrap-icons/font/bootstrap-icons.css';


createApp(App)
  .use(router)
  .use(store) // 使用 Vuex store
  .mount('#app');