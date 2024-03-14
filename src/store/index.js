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
    // 这里可以添加更多的状态
  },
  mutations: {
    resetState(state) {
      // 重置用户信息
      state.user = {};
      // 重置其他状态
      state.set = {};
      state.lv = {};
      state.data = {};
      state.lastUpdated = {};
      // 根据需要继续添加其他状态重置
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
      console.log(`getData mutation 被调用, key: ${key}, data:`, data);
      // 如果 state.data[key] 不存在，初始化为一个空对象
      if (!state.data[key]) {
        state.data[key] = {};
        console.log(`state.data[${key}] 初始化为一个空对象`);
      }
      // 检查 data 是否为数组
      if (!Array.isArray(data)) {
        console.error(`期望 data 是一个数组，但接收到:`, data);
        return;  // 如果 data 不是数组，则直接返回以避免错误
      }
      // 遍历新数据，更新或添加条目，或者删除标记为 'delete' 的数据项
      data.forEach(item => {
        // 首先检查 item 是否有 id
        if (item && item.id !== undefined) {
          // 检查 item 是否标记为删除
          if (item.delete === true) {
            // 如果标记为删除，则从本地缓存中移除该数据项
            if (state.data[key][item.id]) { // 检查是否存在
              console.log(`移除数据项, id: ${item.id}`, item);
              delete state.data[key][item.id];
            }
          } else {
            // 否则，使用 item.id 作为键，存储或更新数据项
            state.data[key][item.id] = item;
            console.log(`更新或添加数据项, id: ${item.id}`, item);
          }
        } else {
          console.error('数据项缺少 id 或数据项未定义:', item);
        }
      });
    },

    updateData(state, { category, id, newData }) {
      if (state.data[category]) {
          const index = state.data[category].findIndex(item => item.id === id);
          if (index !== -1) {
              // 更新已存在的条目
              state.data[category][index] = newData;
          } else {
              // 如果没有找到相应的条目，直接添加
              state.data[category].push(newData);
          }
      } else {
          // 如果这个类别之前不存在，直接创建新的数组
          state.data[category] = [newData];
      }
  },
  
    updateLastUpdated(state, { key, time }) {
      state.lastUpdated[key] = time;
    },
  },
  actions: {
    async fetchDataFromItems({ commit, state }, categories) {
      console.log("开始获取数据，项目列表:", categories);
      for (let item of categories) {
        let moreRecords = true;
        let page = 0;
        const pageSize = 1000; // Supabase 限制
        console.log(`开始获取 ${item} 的数据`);
        while (moreRecords) {
          let query = supabase.from(item).select('*').range(page * pageSize, (page + 1) * pageSize - 1);

          // 如果存在最后更新时间，则只查询更新的记录
          if (state.lastUpdated[item]) {
            console.log(`${item}: 获取更新时间后的数据，上次更新时间为 ${state.lastUpdated[item]}`);
            query = query.gte('created_at', state.lastUpdated[item]);
          }
          const { data, error } = await query;
          if (error) {
            console.error(`获取 ${item} 数据失败:`, error);
            break; // 出错则跳出循环
          } else if (data.length > 0) {
            console.log(`${item}: 本次获取了 ${data.length} 条数据`, data);
            commit('getData', { key: item, data });
            if (data.length < pageSize) {
              moreRecords = false; // 如果返回的数据少于 pageSize，说明已经是最后一页
            } else {
              page++; // 准备加载下一页
            }
          } else {
            console.log(`${item}: 没有更多数据`);
            moreRecords = false; // 没有数据说明已经到最后
          }
        }
        // 更新最后更新时间
        commit('updateLastUpdated', { key: item, time: new Date().toISOString() });
      }
    },


    async fetchUser({ commit }, userEmail) { // 首先获取用户信息
      let { data: userData, error: userError } = await supabase.from('teacher').select().eq('mail', userEmail);
      if (userError) {
        console.error('获取 user 数据失败', userError);
        return;  // 如果发生错误，提前退出函数
      }
      if (userData.length === 0) {
        console.error('未找到用户数据');
        return;  // 如果没有找到用户数据，也提前退出
      }
      // 将获取的用户数据存储到 Vuex state
      const user = userData[0];
      commit('setUser', user);  // 假设我们关心的是第一条数据

      // 然后使用用户的 role 来获取 level 信息
      if (user.role) {  // 检查 role 是否存在
        let { data: levelData, error: levelError } = await supabase.from('level').select().eq('name', user.role);
        if (levelError) {
          console.error('获取 level 数据失败', levelError);
          return;
        }
        if (levelData.length > 0) {
          // 将获取的 level 数据存储到 Vuex state
          commit('setLevel', levelData[0]);  // 假设我们关心的是第一条数据
        } else {
          console.log('没有找到对应的 level 数据');
        }
      } else {
        console.log('用户没有定义 role，使用默认值');
        // 用户没有 role 或 role 为空，使用默认值 'teacher'
        let { data: levelData, error: levelError } = await supabase.from('level').select().eq('name', 'teacher');
        if (levelError) {
          console.error('获取默认 level 数据失败', levelError);
          return;
        }
        if (levelData.length > 0) {
          // 将获取的默认 level 数据存储到 Vuex state
          commit('setLevel', levelData[0]);
        } else {
          console.log('没有找到对应的默认 level 数据');
        }
      }
    },

  },
  computed: {
    crmDataArray() {
      return this.$store.getters.dataAsArray('crm');
    }
  },
  getters: {
    // 将对象数据转换为数组
    dataAsArray: (state) => (key) => {
      return Object.values(state.data[key] || {});
    }
  }
});
