import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode:'history',
    routes: [
        {
            path: '/',
            redirect: '/Dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/Dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '首页' }
                },
                {
                    path: '/UserManage',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/UserManage.vue'),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/AdminManage',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/AdminManage.vue'),
                    meta: { title: '管理员管理' }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: '/neo4j',
                    component: () => import(/* webpackChunkName:"neo4j" */ '../components/page/Neo4j.vue'),
                    meta: { title:'数据库图形界面' }
                },
                {
                    path: '/entityForm',
                    component: () => import(/* webpackChunkName:"entityForm" */ '../components/page/EntityForm.vue'),
                    meta: { title: '实体表管理' }
                },
                {
                    path: '/relationForm',
                    component: () => import(/* webpackChunkName:"relationForm" */ '../components/page/RelationForm.vue'),
                    meta: { title: '关系表管理' }
                },
                {
                    path: '/questionForm',
                    component: () => import(/* webpackChunkName:"question"*/ '../components/page/QuestionForm.vue'),
                    meta: {title: '问题表管理'}
                },
                {
                    path: '/questionTemplateForm', component: () => import(/* webpackChunkName: */ '../components/page/QuestionTemplateForm.vue'),
                    meta: {title: '问题模板表管理' }
                },
                {
                    path: '/feedbackForm',
                    component: () => import(/* webpackChunkName: */ '../components/page/FeedbackForm.vue'),
                    meta: {title: '用户反馈管理'}
                },
                {
                    path: '/userInformation',
                    component: () => import(/* webpackChunkName: */ '../components/page/UserInformation.vue'),
                    meta: {title:'个人信息修改'}
                },
                {
                    path: '/logs',
                    component: () => import(/* webpackChunkName: */ '../components/page/Logs.vue'),
                    meta: {title:'后台管理系统日志'}
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '/forgetPassword',
            component: () => import(/* webpackChunkName: "forget" */'../components/page/ForgetPassword.vue'),
            meta: { title:'忘记密码' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
