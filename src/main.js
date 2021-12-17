import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import globalData from '@/api/global_data.js'
import axios from '../node_modules/axios';
import qs from '../node_modules/qs';
Vue.prototype.GLOBAL = globalData;
Vue.prototype.$axios = axios; //全局注册，使用方法为:this.$axios
Vue.prototype.qs = qs;
Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});

// 使用钩子函数对路由进行权限跳转,全局路由守卫
router.beforeEach((to, from, next) => {
    if (globalData.token == '' && to.path !== '/login' &&to.path !== '/forgetPassword') {
        next('/login');
    } else {
        next();
    }
});

new Vue({
    router,
    i18n,
    render: h => h(App)  //将其编辑成虚拟DOM结点
}).$mount('#app');   //代表该vue实例是一个根vue实例！！！挂载到根节点上！  