<script setup>
import { supabase } from './supabase'; 
</script>

<template>
  <div id="app">
    <div class="router-height">
      <router-view></router-view> <!-- 页面内容 -->
      <BottomNav /> <!-- 底部导航 -->
    </div>
  </div>
</template>

<script>
import BottomNav from './components/BottomNav.vue';

export default {
  name: 'App',
  data() {
    return {
      // 其他数据属性
    };
  },
  components: {
    BottomNav
  },
  methods: {
    async checkUserSession() {
      console.log("开始检查");
      const { data: { session } } = await supabase.auth.getSession();

      console.log("session", session);
      if (session) {
        console.log("已登录");
        await this.$store.dispatch('fetchUser', session.user.email);
        // 获取重定向目标页面
        const homeRoute = this.$store.state.lv.index || '/';
        this.$router.push(homeRoute);

        // 获取并请求数据
        const categories = this.$store.state.lv.item || [];
        console.log(categories)
        await this.$store.dispatch('fetchDataFromItems', categories);
        console.log('数据:', this.$store.state);
      } else {
        // 用户未登录，重定向到登录页面
        this.$router.push('/');
        console.log("未登录");
      }
    },

  },
  mounted() {
    this.checkUserSession();
  },
};
</script>
<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

/* 添加CSS样式 */
.router-height {
  height: 97vh;
  /* 设置高度为视窗高度的 92% */
  overflow: auto;
  /* 如果内容超出高度，允许滚动 */
}
</style>
