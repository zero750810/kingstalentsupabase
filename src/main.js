// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from '/router/index';
import store from '/store/index';


createApp(App)
  .use(router)
  .use(store) // 使用 Vuex store
  .mount('#app');