<template>
    <div>
        <h1>歡迎來到首頁</h1>
        <button v-if="!isLoggedIn" @click="signInWithGoogle">使用 Google 登錄</button>
        <button @click="signOut">登出</button>
        <div v-if="isLoggedIn">

            <!-- 這裡可以添加更多關於用戶的信息 -->
        </div>

    </div>
</template>

<script>
import { supabase } from '@/supabase';
import { mapState } from 'vuex';

export default {
    data() {
        return {
            isLoggedIn: false, // 控制登錄按鈕的顯示
            userData1: null, // 存儲用戶信息
        };
    },
    methods: {
        async signInWithGoogle() {
            try {
                const { user, session, error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: 'https://zero750810.github.io/kingstalent/'
                      //  redirectTo: 'http://localhost:5173/kingstalent/'
                    }
                });
                if (error) throw error;
                console.log('登錄成功', user, session);
                this.isLoggedIn = true;
                this.userData1 = user;
            } catch (error) {
                console.error('登錄失敗', error.message);
            }
        },
      
        async signOut() {
            try {
                const { error } = await supabase.auth.signOut();
                if (error) throw error;

                // 重置應用狀態
                this.$store.commit('resetState');

                console.log('登出成功');
            } catch (error) {
                console.error('登出失敗', error.message);
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
/* 在這裡添加你的 CSS 樣式 */
</style>

