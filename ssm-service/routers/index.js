const express = require('express')
//获取路由对象
const router = express.Router()

router.get("/",(req,res)=>{
    res.send('测试成功')
})

router.get("/test",(req,res)=>{
    res.send('测试成功')
})

module.exports = router