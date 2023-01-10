# 学员管理系统

## 项目描述
是基于vue2.6.11的学员管理系统，该项目为针对学校学生、教师、专业进行同一管理的后台管理使用平台，因为学生比较多而且分数的班级和授课教师及学管比较杂，不方便信息查询及管理，所以将所有学生及教师等集中到一个平台上方便快速查询学员信息


## 技术选型

vue 省去复杂的节点查询，实现双向数据绑定，降低页面维护难度
VueDevTools 路由方面的信息，组件中的数据，vuex中状态
VueRoter 配置路由链接进行组件展示切换，配置子路由，路由传递参数，路由守卫拦截用户登录状态
VueLoader 打包.vue单文件组件
VueCli 搭建项目基本环境
Vuex user信息统一管理
npm 安装各种依赖
vscode  开发调试工具
axios 手动封装，配置了拦截器（主要用于loading效果开启和关闭，全局异常消息提示）
ES6  let、const、箭头函数、Promise
Webpack 资源打包
Element-ui  Dropdown下拉菜单、NavMenu导航菜单、Table表格、Pagination分页、Form表单（行内表单、数据校验/自定义校验规则、重置）、dialog对话框、DatePicker日期选择器、Loading加载效果、Message消息提示、upload图片上传
Babel 将ES6语法代码转换成ES5防止浏览器不识别
Eslint 代码格式监测及格式化
Nodejs和express 后端服务接口搭建
mongodb/mongoose 数据库、表创建以及对数据的增删改查
vue-tinymce 富文本编辑框

## 项目部署

如果需要部署这个项目的话,需要进入ssm-service(并不是使用ssm框架部署)文件下,控制台使用 node app.js 命令就可以启动项目,

##前端项目

前端项目保存在了sms文件夹下,smm-service/public下是已经打包好的文件

## 后端项目

后台是用js搭建,默认端口号为3000,如需修改修改app.js文件内下面这段代码,将3000改为需要的端口即可

    app.listen('3000', () => {
        console.log("服务器启动成功,请启动http://127.0.0.1:3000");
    })


