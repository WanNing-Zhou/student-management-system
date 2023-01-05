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
const app = express()

//使用中间件
app.use(express.static('public'))
//
app.use(bodyParser.urlencoded({ extended: false}))

app.use(bodyParser.json())

// 开放node_modules路径
app.use('/node_modules',express.static(path.join(__dirname,'./node_modules')))

//路由器中间件文件
const indexRouter = require('./routers')
app.use("/",indexRouter)

//通过mongoose连接数据库


