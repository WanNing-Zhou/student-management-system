// const { defineConfig } = require("@vue/cli-service");
module.exports ={
  devServer:{
    port:8000,
    host:'localhost',
    https:false,
    open:true
  },
  lintOnSave:false,
  productionSourceMap:false
}
