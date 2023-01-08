const express = require('express')
//获取路由对象
const router = express.Router()
const UserModel = require('../models/UserModel')
const md5 = require('blueimp-md5')
const RoleModel = require('../models/RoleModel')
const SchoolModel = require('../models/SchoolModel')



//post请求, 请求地址 '/login'
router.post('/login', (req, res) => {
    const {username, password} = req.body  //结构赋值获取username 与 password

    UserModel.findOne({username, password: md5(password)}).then(user => { //根据用户名密码查询用户
        if (user) {//登录成功
            if (user.role_id) { //如果角色id存在
                RoleModel.findOne({username, password: md5(password)}).then(role => {
                    user._doc.role = role
                    res.send({status: 0, data: user}) //将角色id返回
                })
            } else { //这个是超级管理员的情况
                user._doc.role = {menus: []}
                res.send({status: 0, data: user})
            }

        } else {
            res.send({status: 1, msg: '用户名密码不存在'})
        }

    }).catch(error => {
        console.log('登录异常', error);
        res.send({status: 1, msg: '登录异常'})
    })
})

//获取角色列表
router.get('/manage/role/list', (req, res) => {
    RoleModel.find().then(roles => {
        res.send({status: 0, data: roles})
    }).catch(error => {
        console.log('获取角色列表异常', error)
        res.send({status: 1, msg: '获取角色列表异常,请稍后重试'})
    })
})

//添加角色
router.post('/manage/role/add', (req, res) => {
    const {name} = req.body
    RoleModel.create({name}).then(role => {
        res.send({status: 0, data: role})
    }).catch(error => {
        console.log("添加角色异常")
        res.send({status: 1, msg: '添加角色异常,请稍后再试'})
    })
})

//更新角色(设置权限)
router.post('/manage/role/update', (req, res) => {
    const role = req.body
    role.auth_time = Date.now()
    RoleModel.findOneAndUpdate({_id: role._id}, role).then(oldRole => {
        res.send({status: 0, data: {...oldRole._doc, ...role}})     //中间利用es6的合并对象
    }).catch(error => {
        console.log("更新角色异常", error)
        res.send({status: 1, msg: "更新角色异常,请稍后再试"})
    })
})


//获取所有用户
router.get('/manage/user/all', (req, res) => {
    UserModel.find({username: {'$ne': 'admin'}}).then(users => { //在数据库中查询所有非admin用户
        res.send({status: 0, data: users})
    }).catch(error => {
        console.log("获取所有用户异常", error)
        res.send({status: 1, msg: '获取所有用户异常'})
    })
})

//获取用户列表(分页)
router.post('/manage/user/list', (req, res) => {
    let page = req.body.page || 1;
    let size = req.body.size || 5;
    UserModel.find({username: {'$ne': 'admin'}}).then(users => {
        let count = users.length
        UserModel.find({username: {'$ne': 'admin'}}).skip((page - 1) * parseInt(size)).limit(parseInt(size)).exec((err, data) => {
            RoleModel.find().then(roles => {
                res.send({
                    status: 0,
                    data: {total: count, data, roles}
                })
            })
        })
    }).catch(error => {
        console.log("获取用户列表异常", error)
        res.send({status: 1, msg: '获取所有用户异常'})
    })
})

//添加用户
router.post('/manage/user/add', (req, res) => {
    const {username, password} = req.body
    UserModel.findOne({username}).then(user => {
        if (user) {
            res.send({status: 1, msg: '此用户已存在'})
            return new Promise(() => {
            })
        } else {
            return UserModel.create({...req.body, password: md5(password)})
        }
    }).then(user => {
        res.send({status: 0, data: user})
    }).catch(err => {
        console.log("添加用户异常", err)
        res.send({status: 1, msg: '添加用户异常'})
    })
})

//根据id查询用户
router.get('/manage/user/find', (req, res) => {
    const user = req.query
    UserModel.findById({_id: user._id}).then(data => {
        res.send({status: 0, data})
    }).catch(err => {
        console.log("根据id查询用户异常", err)
        res.send({status: 1, msg: "根据id查询用户异常"})
    })
})


//更新用户数据
router.post('/manage/user/update', (req, res) => {
    const user = req.body
    UserModel.findOneAndUpdate({_id: user._id}, user).then(oldUser => {
        res.send({status: 0, data: {...oldUser._doc, ...user}})     //中间利用es6的合并对象
    }).catch(error => {
        console.log("更新用户异常", error)
        res.send({status: 1, msg: "更新用户异常,请稍后再试"})
    })
})

//删除用户
router.post('/manage/user/delete', (req, res) => {
    const {userId} = req.body;
    UserModel.deleteOne({_id: userId}).then(data => {
        res.send({status: 0})
    })
})


//获取权限列表
router.post('/menus', (req, res) => {
    const {roleId} = req.body
    RoleModel.findOne({_id: roleId}).then(role => {
        res.send({status: 0, data: {menus: role.menus}})
    }).catch(error => {
        console.log("更新用户异常", error)
        res.send({status: 1, msg: "获取权限列表异常,请稍后再试"})
    })
})


//获取学校列表
router.post('/manage/school/list', (req, res) => {
    let page = req.body.page || 1;
    let size = req.body.size || 5;
    SchoolModel.find({}).then(schools => {
        let count = schools.length
        SchoolModel.find().skip((page - 1) * parseInt(size)).limit(parseInt(size)).exec((err, data) => {
            SchoolModel.find().then(roles => {
                res.send({
                    status: 0,
                    data: {
                        total: count,
                        data,
                        roles
                    }
                })
            })
        })
    }).catch(error => {
        console.error('获取学校列表异常', error);
        res.send({
            status: 1,
            msg: '获取学校列表异常,请稍后再试！'
        })
    })
})

router.get('/manage/school/all', (req, res) => {
    SchoolModel.find().then(schools => {
        res.send({
            status: 0,
            data: schools
        })
    }).catch(error => {
        console.error("获得所有学校异常", error);
        res.send({
            status: 1,
            msg: "获取所有学校异常,请稍后再试"
        })
    })
})


router.post('/manage/school/add', (req, res) => {
    //读取请求参数数据
    const {
        schoolname
    } = req.body;
    //处理:判断用户是否已经存在,如果存在返回错误信息,如果不存在保存
    //查询(根据username)
    SchoolModel.findOne({
        schoolname
    }).then(school => {
        if (school) {
            res.send({
                status: 1,
                msg: '此学校已存在'
            });
            return new Promise(() => {
            })
        } else {
            //没值(不存在)
            //保存
            return SchoolModel.create({
                ...req.body,
            });
        }
    }).then(school => {
        //返回包含user的json数据
        res.send({
            status: 0,
            data: school
        })
    }).catch(error => {
        console.error('添加学校异常', error);
        res.send({
            status: 1,
            msg: '添加学校异常,请重新尝试'
        });
    })
})


//id查询数学校
router.get('/manage/school/find', (req, res) => {
    const school = req.query;
    SchoolModel.findById({
        _id: school._id
    }).then(data => {
        res.send({
            status: 0,
            data
        })
    }).catch(error => {
        console.error('根据id查询学校异常', error);
        res.send({
            status: 1,
            msg: '根据id查询学校异常,请重新尝试'
        })
    })
})

//提交修改数据接口
//更新学校
router.post('/manage/school/update', (req, res) => {
    const school = req.body
    SchoolModel.findOneAndUpdate({
        _id: school._id
    }, school).then(oldSchool => {
        const data = Object.assign(oldSchool, school)
        res.send({
            status: 0,
            data
        })
    }).catch(error => {
        console.error('更新学校异常', error);
        res.send({
            status: 1,
            msg: '更新学校异常,请稍后再试！'
        })
    })
})

//删除学校
router.post('/manage/school/delete', (req, res) => {
    const {
        schoolId
    } = req.body;
    SchoolModel.deleteOne({
        _id: schoolId
    }).then(doc => {
        res.send({
            status: 0
        })
    }).catch(error => {
        console.error('删除学校信息异常', error);
        res.send({
            status: 1,
            msg: '删除学校信息异常,请重新尝试'
        })
    })
})


module.exports = router