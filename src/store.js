import Vuex from 'vuex';
import Vue from 'vue';
Vue.use(Vuex);
const store=new Vuex.Store({
    state: {
        baseURL: '/api',
        token: undefined,
        userInfo: {
            admin_type: '1',
            name: 'test',
            account: 'afln',
            phone: '110',
            head: '2',
            email: '100@qq.com',
            register_time: '2021-01-01 00:00:00',
            password: 'test'
        }
    },
  mutations: {
      setUserinfomation(state, payload) {
          state.userInfo = payload;
      },
      setToken(state, payload) { state.token = payload; },
      getToken(state) {
          return state.token
      },
      setHead(state, payload) { state.userInfo.head = payload;}
  }
    })
export default store;