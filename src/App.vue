<script setup>
import { supabase } from './supabase'; 
</script>

<template>
  <div id="app">
    <router-view></router-view> <!-- 页面内容 -->
    <BottomNav /> <!-- 底部导航 -->
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
  const session = await supabase.auth.getSession();
  if (session.data.session) {
    await this.$store.dispatch('fetchUser', session.data.session.user.email);
    // 获取重定向目标页面
    const homeRoute = this.$store.state.lv.index || '/';
    this.$router.push(homeRoute);
    
    // 这里获取要请求的数据类别，然后传给 fetchDataFromItems
    const categories = this.$store.state.lv.item || []; // 获取 items 数组，如果没有则为默认空数组
    await this.$store.dispatch('fetchDataFromItems', categories);
    console.log('数据:', this.$store.state);
  } else {
    // 如果用户未登录且当前不在登录页面，则重定向到登录页
    this.$router.push('/');
  }
}

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
</style>
