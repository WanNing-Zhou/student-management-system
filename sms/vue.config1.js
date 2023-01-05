// const { defineConfig } = require("@vue/cli-service");
module.exports ={
  devServer:{
    port:8000,//将端口号设置为8000
    host:'localhost',
    https:false,
    open:true,
    //开器代理服务器,仅在生产环境中
    // proxy:{
    //   //这里的process.env.VUE_APP_BASE_API作为key值 匹配到/dev-api 就代理到localhost:3000
    //   [process.env.VUE_APP_BASE_API]:{
    //     //目标地址
    //     target:process.env.VUE_APP_SERVICE_URL,
    //     //开启代理
    //     changeOrigin:true,
    //     //将路径重写
    //     pathRewrite:{
    //       //以/dev-api 替换为 '' 字符串, 也就是将路径中的/dev-api删除了,因为后端请求路径中没有/dev-api 不重写会爆404
    //       ['^' + process.env.VUE_APP_BASE_API]: ''
    //     }
    //   }
    // }
    proxy: { //配置代理
      //匹配/dev-api 就代理到localhost:3000,[process]里面值其实就是dev-api
      [process.env.VUE_APP_BASE_API]: {
        //指定目标服务器process.env.vue...就是配置常量中的值http://localhost:3000
        target: process.env.VUE_APP_SERVICE_URL,
        //开启代理
        changeOrigin: true,
        //请求路径重写
        pathRewrite: {
          //dev-api替换为空字符串,也就是将路径中的/dev-api删除了,因为后端请求路径中是没有的/dev-api
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  },
  lintOnSave:false,
  productionSourceMap:false
}
