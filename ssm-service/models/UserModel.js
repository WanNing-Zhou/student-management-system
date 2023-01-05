const mongoose = require('mongoose');
const md5 = require('blueimp-md5')
//文档描述规则
//为添加进数据库的数据添加规则
const userSchema = new mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true},
    phone:String,
    create_time:{type:Number, default:Date.now()},
    role_id:String
})

//users为数据库表的名字   模型
const UserModel = mongoose.model('users',userSchema);

//查找超级管理员
UserModel.findOne({username:'admin'}).then(user=>{
    //如果没有查询到超级管理员,就自动分配一个超级管理员身份
    if(!user){
        UserModel.create({username:'admin',password:md5('admin')}).then(user=>{
            console.log('初始化用户: 用户名: admin 密码: admin')
        })
    }
})

//将UserModel暴露出去
module.exports = UserModel