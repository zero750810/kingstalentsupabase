<template>
    <div class="bottom-nav">
      <button v-for="(item, index) in processedNavItems" :key="index" @click="navigateTo(item.route)">
        {{ item.name }}
      </button>
    </div>
</template>  
  <script>
  import { mapState } from 'vuex';  
  export default {
    computed: {
      // 使用 mapState 辅助函数从 store 的 state 中获取 navItems 数据
      ...mapState({
            rawNavItems: state => state.lv.nav // 获取原始权限数据
        }),
      processedNavItems() {
            // 处理原始权限数据以生成底部导航所需的格式
            if (Array.isArray(this.rawNavItems)) {
                return this.rawNavItems.map(item => ({
                    name: item, // 假设原始数据只包含名称
                    route: "/" + item.replace(/\s+/g, '-').toLowerCase() // 生成对应的路由
                }));
            } else {
                return []; // 返回空数组作为默认值
            };
        }
    },
    methods: {
      navigateTo(route) {
        // 使用 vue-router 的编程式导航
        this.$router.push({ path: route });
      }
    }
  }
  </script>  
  <style scoped>
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-around;
    background-color: #f8f8f8; /* Example style */
  }
  </style>  