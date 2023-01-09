import Vue from "vue";
import VueRouter from "vue-router";
import Login from '@/views/login/index'
import Layout from "@/components/Layout";
import Home from "@/views/home"
import User from "@/views/user"
import Role from "@/views/role"
import School from "@/views/students/School"
import Majors from "@/views/students/Majors"
import Student from "@/views/students/Student"
import Class from "@/views/students/Class"
import StudentUpdate from "@/views/students/StudentUpdate";

Vue.use(VueRouter);

const routes = [
  {
    //登录页
    path:'/login',
    name:'login',
    component:Login
  },
  {
    //基础布局
    path: '/',
    name: 'layout',
    component: Layout,
    redirect: '/home', //当访问到 / 路径的时候,重定向得到 /home 页面

    children: [{
      path: '/home',
      component: Home,
      meta: {
        title: '首页'
      }
    }]
  }, {
    //用户管理
    path: '/user',
    component: Layout,
    children: [{
      path: '/',
      component: User,
      meta: {
        title: '用户管理'
      }
    }]

  }, {
    //角色管理
    path: '/role',
    component: Layout,
    children: [{
      path: '/',
      component: Role,
      meta: {
        title: '角色管理'
      }
    }]
  }, {
    //学校管理
    path: '/school',
    component: Layout,
    children: [{
      path: '/',
      component: School,
      meta: {
        title: '学校管理'
      }
    }]
  }, {
    //专业管理
    path: '/major',
    component: Layout,
    children: [{
      path: '/',
      component: Majors,
      meta: {
        title: '专业管理'
      }
    }]
  }, {
    //班级管理
    path: '/class',
    component: Layout,
    children: [{
      path: '/',
      component: Class,
      meta: {
        title: '班级管理'
      }

    }]
  }, {
    //学生管理
    path: '/student',
    component: Layout,
    children: [{
      path: '/',
      component: Student,
      meta: {
        title: '学生管理'
      }
    },
    ]
  },
  {
    //学生管理
    path: '/student/update/:_id',
    component: Layout,
    children: [{
      path: '/',
      component: StudentUpdate,
      meta: {
        title: '学生编辑'
      }
    },]
  },
];





const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
