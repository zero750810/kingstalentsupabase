// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { supabase } from '@/supabase';  // 确保正确导入 Supabase 客户端

const routes = [
    // 定义路由
    { path: '/', component: () => import('../components/login.vue') },
    { path: '/首頁', component: () => import('../components/index.vue') },
    { path: '/客戶管理', component: () => import('../components/crm.vue') },
    { path: '/行事曆', component: () => import('../components/calendar.vue') },
    { path: '/課程教案', component: () => import('../components/event.vue') },
    { path: '/產品庫存', component: () => import('../components/inventory.vue') },
    { path: '/師資資料', component: () => import('../components/TeacherData.vue') },
    { path: '/數據表格', component: () => import('../components/grid.vue') },
    { path: '/個人資料', component: () => import('../components/teacheredit.vue') },
    // 你可以添加更多路由
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
