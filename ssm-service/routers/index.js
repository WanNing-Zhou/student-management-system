const express = require('express')
//获取路由对象
const router = express.Router()
const UserModel = require('../models/UserModel')
const md5 = require('blueimp-md5')
const RoleModel = require('../models/UserModel')




//post请求, 请求地址 '/login'
router.post('/login', (req, res) => {
    const {username, password} = req.body  //结构赋值获取username 与 password

    UserModel.findOne({username, password: md5(password)}).then(user => { //根据用户名密码查询用户
        if (user) {//登录成功
            user._doc.role = {
                menus: []
            }
            res.send({status: 0, data: user})
        } else {
            res.send({status: 1, msg: '用户名密码不存在'})
        }

    }).catch(error => {
        console.log('登录异常', error);
        res.send({status: 1, msg: '登录异常'})
    })
})

//获取角色列表
router.get('/manage/role/list',(req,res)=>{
    RoleModel.find().then(roles=>{
        res.send({status:0,data:roles})
    }).catch(error=>{
        console.log('获取角色列表异常',error)
        res.send({status:1,msg:'获取角色列表异常,请稍后重试'})
    })
})


module.exports = router