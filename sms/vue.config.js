module.exports = {
    devServer: {
        port: 8000,
        host: "localhost",
        https: false,
        open: true,
        proxy: { //配置代理
            //匹配/dev-api 就代理到localhost:3000,[prcess]里面值其实就是dev-api
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
    lintOnSave: false,
    productionSourceMap: false,
}