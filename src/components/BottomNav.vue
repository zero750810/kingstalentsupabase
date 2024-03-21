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
      // 使用 mapState 輔助函數從 store 的 state 中獲取 navItems 數據
      ...mapState({
            rawNavItems: state => state.lv.nav // 獲取原始權限數據
        }),
      processedNavItems() {
            // 處理原始權限數據以生成底部導航所需的格式
            if (Array.isArray(this.rawNavItems)) {
                return this.rawNavItems.map(item => ({
                    name: item, // 假設原始數據只包含名稱
                    route: "/" + item.replace(/\s+/g, '-').toLowerCase() // 生成對應的路由
                }));
            } else {
                return []; // 返回空數組作為默認值
            };
        }
    },
    methods: {
      navigateTo(route) {
        // 使用 vue-router 的編程式導航
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