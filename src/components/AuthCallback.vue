<template>
  <div>处理登录中...</div>
</template>

<script>
export default {
  mounted() {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token'); // 获取访问令牌
    const error = params.get('error'); // 获取任何可能的错误

    if (accessToken) {
      // 处理access token，例如保存到localStorage，并重定向用户
      localStorage.setItem('access_token', accessToken);
      this.$router.push('/456789/'); // 重定向到主页或其他页面
    } else if (error) {
      // 处理错误，例如显示错误信息
      console.error('OAuth登录失败:', error);
      this.$router.push('/login'); // 重定向回登录页面
    }
  }
};
</script>
