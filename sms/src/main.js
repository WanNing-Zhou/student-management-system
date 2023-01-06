import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import memoryUtils from "@/utils/memoryUtils";
import storageUtils from "@/utils/storageUtils";


Vue.config.productionTip = false;
//全局引入ElementUI组件
Vue.use(ElementUI)
console.log(process.env.VUE_APP_BASE_API)

//程序初始化的时候就从localStorage中获取user对象
const user = storageUtils.getUser()
//如果用户存在,则放在memoryUtils,方便程序读取,不用每次都从数据库中去取
if(user && user._id){
  memoryUtils.user = user //用于在各个组件中使用
  login(memoryUtils.user)
}

//在获取本地用户时后,引入路由守卫
import '@/permission'
import {login} from "@/api/login";

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
