<template>
    <div>
        <h1>欢迎来到首页</h1>
        <button v-if="!isLoggedIn" @click="signInWithGoogle">使用 Google 登录</button>
        <button @click="signOut">登出</button>
        <div v-if="isLoggedIn">
            
            <!-- 这里可以添加更多关于用户的信息 -->
        </div>
        
    </div>
</template>

<script>
import { supabase } from '@/supabase';
import { mapState } from 'vuex';

export default {
    data() {
        return {
            isLoggedIn: false, // 控制登录按钮的显示
            userData1: null, // 存储用户信息
        };
    },
    methods: {
        async signInWithGoogle() {
            try {
                const { user, session, error } = await supabase.auth.signInWithOAuth({
                    provider: 'google'
                });
                if (error) throw error;
                console.log('登录成功', user, session);
                this.isLoggedIn = true;
                this.userData1 = user;
            } catch (error) {
                console.error('登录失败', error.message);
            }
        },
        async signOut() {
            try {
                const { error } = await supabase.auth.signOut();
                if (error) throw error;

                // 重置应用状态
                this.$store.commit('resetState');

                console.log('登出成功');
            } catch (error) {
                console.error('登出失败', error.message);
            }
        }

    },
    mounted() {
    },
    computed: {
        ...mapState(['userData', 'tableData', 'setlv'])
    }

}
</script>
<style scoped>
/* 在这里添加你的 CSS 样式 */
</style>
