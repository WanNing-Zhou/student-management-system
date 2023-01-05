import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false;
//全局引入ElementUI组件
Vue.use(ElementUI)
console.log(process.env.VUE_APP_BASE_API)
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
