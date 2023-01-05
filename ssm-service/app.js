/*
    后端应用的启动模块
    1.通过express启动服务
    2.通过mongoose连接数据库
        只有当数据库连接成功后才会启动服务
     3.使用中间件
 */

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
// const bodyParser = require("body-parser");
const app = express()

//使用中间件
app.use(express.static('public'))
//bodyParser已经被弃用了
// app.use(bodyParser.urlencoded({ extended: false}))
//
// app.use(bodyParser.json())
//express框架内部已经实现了对post参数的解析 现在只需要在const app =express()下面配置以下程序即可，不需要再单独下载一个包了

app.use(express.json)
app.use(express.urlencoded({extended:false}))

// 开放node_modules路径
app.use('/node_modules',express.static(path.join(__dirname,'./node_modules')))

//路由器中间件文件
const indexRouter = require('./routers')
app.use('/', indexRouter)



// 通过mongoose连接数据库
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost/sms_service', {
    useNewUrlParser: true
}).then(() => {
    console.log("连接成功");
    app.listen('3000', () => {
        console.log("服务器启动成功,请启动http://127.0.0.1:3000");
    })
}).catch((error) => {
    console.log("连接失败");
    console.log(error);
})

