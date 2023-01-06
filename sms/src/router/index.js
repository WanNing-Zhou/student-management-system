import Vue from "vue";
import VueRouter from "vue-router";
import Login from '@/views/login/index'
import Layout from "@/components/Layout";

Vue.use(VueRouter);

const routes = [
  {
    //登录页
    path:'/login',
    name:'login',
    component:Login
  },
  {
    path:'/',
    name:'layout',
    component: Layout
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
