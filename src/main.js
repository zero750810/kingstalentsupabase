// src/main.js
import { createApp } from './vue';
import App from './App.vue';
import router from './router';
import store from './store'; // 引入 Vuex store
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';


createApp(App)
  .use(router)
  .use(store) // 使用 Vuex store
  .mount('#app');