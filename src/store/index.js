// src/store/index.js
import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { supabase } from '@/supabase';
export default createStore({
  plugins: [createPersistedState()],
  state: {
    user: {},
    set: {},
    lv: {},
    data: {},
    lastUpdated: {},
    // 這裡可以添加更多的狀態
  },
  mutations: {
    resetState(state) {
      // 重置用戶信息
      state.user = {};
      // 重置其他狀態
      state.set = {};
      state.lv = {};
      state.data = {};
      state.lastUpdated = {};
      // 根據需要繼續添加其他狀態重置
    },
    setLastUpdated(state, { key, timestamp }) {
      state.lastUpdated[key] = timestamp;
    },
    setUser(state, userData) {
      state.user = userData;
    },
    setLevel(state, lvData) {
      state.lv = lvData;
    },
    setSet(state, setData) {
      state.set = setData;
    },
    getData(state, { key, data }) {
      console.log(`getData mutation 被調用, key: ${key}, data:`, data);
      // 如果 state.data[key] 不存在，初始化為一個空對象
      if (!state.data[key]) {
        state.data[key] = {};
        console.log(`state.data[${key}] 初始化為一個空對象`);
      }
      // 檢查 data 是否為數組
      if (!Array.isArray(data)) {
        console.error(`期望 data 是一個數組，但接收到:`, data);
        return;  // 如果 data 不是數組，則直接返回以避免錯誤
      }
      // 遍歷新數據，更新或添加條目，或者刪除標記為 'delete' 的數據項
      data.forEach(item => {
        // 首先檢查 item 是否有 id
        if (item && item.id !== undefined) {
          // 檢查 item 是否標記為刪除
          if (item.delete === true) {
            // 如果標記為刪除，則從本地緩存中移除該數據項
            if (state.data[key][item.id]) { // 檢查是否存在
              console.log(`移除數據項, id: ${item.id}`, item);
              delete state.data[key][item.id];
            }
          } else {
            // 否則，使用 item.id 作為鍵，存儲或更新數據項
            state.data[key][item.id] = item;
            console.log(`更新或添加數據項, id: ${item.id}`, item);
          }
        } else {
          console.error('數據項缺少 id 或數據項未定義:', item);
        }
      });
    },

    updateData(state, { category, id, newData }) {
      if (state.data[category]) {
          const index = state.data[category].findIndex(item => item.id === id);
          if (index !== -1) {
              // 更新已存在的條目
              state.data[category][index] = newData;
          } else {
              // 如果沒有找到相應的條目，直接添加
              state.data[category].push(newData);
          }
      } else {
          // 如果這個類別之前不存在，直接創建新的數組
          state.data[category] = [newData];
      }
  },
  
    updateLastUpdated(state, { key, time }) {
      state.lastUpdated[key] = time;
    },
  },
  actions: {
    async fetchDataFromItems({ commit, state }, categories) {
      console.log("開始獲取數據，項目列表:", categories);
      for (let item of categories) {
        let moreRecords = true;
        let page = 0;
        const pageSize = 1000; // Supabase 限制
        console.log(`開始獲取 ${item} 的數據`);
        while (moreRecords) {
          let query = supabase.from(item).select('*').range(page * pageSize, (page + 1) * pageSize - 1);
          // 如果存在最後更新時間，則只查詢更新的記錄
          if (state.lastUpdated[item]) {
            console.log(`${item}: 獲取更新時間後的數據，上次更新時間為 ${state.lastUpdated[item]}`);
            query = query.gte('created_at', state.lastUpdated[item]);
          }
          const { data, error } = await query;
          if (error) {
            console.error(`獲取 ${item} 數據失敗:`, error);
            break; // 出錯則跳出循環
          } else if (data.length > 0) {
            console.log(`${item}: 本次獲取了 ${data.length} 條數據`, data);
            commit('getData', { key: item, data });
            if (data.length < pageSize) {
              moreRecords = false; // 如果返回的數據少於 pageSize，說明已經是最後一頁
            } else {
              page++; // 準備加載下一頁
            }
          } else {
            console.log(`${item}: 沒有更多數據`);
            moreRecords = false; // 沒有數據說明已經到最後
          }
        }
        // 更新最後更新時間
        commit('updateLastUpdated', { key: item, time: new Date().toISOString() });
      }
    },


    async fetchUser({ commit }, userEmail) { // 首先獲取用戶信息
      let { data: userData, error: userError } = await supabase.from('teacher').select().eq('mail', userEmail);
      if (userError) {
        console.error('獲取 user 數據失敗', userError);
        return;  // 如果發生錯誤，提前退出函數
      }
      if (userData.length === 0) {
        console.error('未找到用戶數據');
        return;  // 如果沒有找到用戶數據，也提前退出
      }
      // 將獲取的用戶數據存儲到 Vuex state
      const user = userData[0];
      commit('setUser', user);  // 假設我們關心的是第一條數據

      // 然後使用用戶的 role 來獲取 level 信息
      if (user.role) {  // 檢查 role 是否存在
        let { data: levelData, error: levelError } = await supabase.from('level').select().eq('name', user.role);
        if (levelError) {
          console.error('獲取 level 數據失敗', levelError);
          return;
        }
        if (levelData.length > 0) {
          // 將獲取的 level 數據存儲到 Vuex state
          commit('setLevel', levelData[0]);  // 假設我們關心的是第一條數據
        } else {
          console.log('沒有找到對應的 level 數據');
        }
      } else {
        console.log('用戶沒有定義 role，使用默認值');
        // 用戶沒有 role 或 role 為空，使用默認值 'teacher'
        let { data: levelData, error: levelError } = await supabase.from('level').select().eq('name', 'teacher');
        if (levelError) {
          console.error('獲取默認 level 數據失敗', levelError);
          return;
        }
        if (levelData.length > 0) {
          // 將獲取的默認 level 數據存儲到 Vuex state
          commit('setLevel', levelData[0]);
        } else {
          console.log('沒有找到對應的默認 level 數據');
        }
      }
    },

  },
  getters: {
    // 將對象數據轉換為數組
    dataAsArray: (state) => (key) => {
      return Object.values(state.data[key] || {});
    }
  }
});

