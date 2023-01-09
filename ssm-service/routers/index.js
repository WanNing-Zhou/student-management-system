const express = require('express')
//获取路由对象
const router = express.Router()
const UserModel = require('../models/UserModel')
const md5 = require('blueimp-md5')
const RoleModel = require('../models/RoleModel')
const SchoolModel = require('../models/SchoolModel')
const MajorModel = require('../models/MajorModel')
const ClassModel = require('../models/ClassModel')
const StudentModel = require('../models/StudentModel')
// const fileUpload = require('file-upload')


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


//专业
//获取所学专业列表(所有)
router.get('/manage/major/all', (req, res) => {
    MajorModel.find().then(majors => {
        res.send({
            status: 0,
            data: majors
        })
    }).catch(error => {
        console.error("获得所有专业异常", erroe);
        res.send({
            status: 1,
            msg: "获取所学专业异常,请稍后再试"
        })
    })
})

//获取专业列表
router.post('/manage/major/list', (req, res) => {
    let page = req.body.page || 1;
    let size = req.body.size || 5;
    MajorModel.find({}).then(majors => {
        let count = majors.length
        MajorModel.find().skip((page - 1) * parseInt(size)).limit(parseInt(size)).exec((err, data) => {
            MajorModel.find().then(roles => {
                res.send({
                    status: 0,
                    data: {
                        total: count,
                        data,
                    }
                })
            })
        })
    }).catch(error => {
        console.error('获取专业列表异常', error);
        res.send({
            status: 1,
            msg: '获取专业列表异常,请稍后再试！'
        })
    })
})


//添加专业
router.post('/manage/major/add', (req, res) => {
    //读取请求参数数据
    const {
        majorname
    } = req.body;
    // console.log(majorname);
    //处理:判断用户是否已经存在,如果存在返回错误信息,如果不存在保存
    //查询(根据username)
    MajorModel.findOne({
        majorname
    }).then(major => {
        if (major) {
            res.send({
                status: 1,
                msg: '此专业已存在'
            });
            return new Promise(() => {
            })
        } else {
            //没值(不存在)
            //保存
            return MajorModel.create({
                ...req.body,
            });
        }
    }).then(major => {
        //返回包含user的json数据
        res.send({
            status: 0,
            data: major
        })
    }).catch(error => {
        console.error('添加专业异常', error);
        res.send({
            status: 1,
            msg: '添加专业异常,请重新尝试'
        });
    })
})

//删除专业
router.post('/manage/major/delete', (req, res) => {
    const {
        majorId
    } = req.body;
    MajorModel.deleteOne({
        _id: majorId
    }).then(doc => {
        res.send({
            status: 0
        })
    }).catch(error => {
        console.error('删除专业信息异常', error);
        res.send({
            status: 1,
            msg: '删除专业信息异常,请重新尝试'
        })
    })
})

//id查询专业
router.get('/manage/major/find', (req, res) => {
    const major = req.query;
    MajorModel.findById({
        _id: major._id
    }).then(data => {
        res.send({
            status: 0,
            data
        })
    }).catch(error => {
        console.error('根据id查询专业异常', error);
        res.send({
            status: 1,
            msg: '根据id查询专业异常,请重新尝试'
        })
    })
})


//提交修改数据接口
//更新专业
router.post('/manage/major/update', (req, res) => {
    const major = req.body
    MajorModel.findOneAndUpdate({
        _id: major._id
    }, major).then(oldMajor => {
        const data = Object.assign(oldMajor, major)
        res.send({
            status: 0,
            data
        })
    }).catch(error => {
        console.error('更新专业异常', error);
        res.send({
            status: 1,
            msg: '更新专业异常,请稍后再试！'
        })
    })
})


//获取班级(所有)
router.get('/manage/class/all', (req, res) => {
    ClassModel.find().then(classs => {
        res.send({
            status: 0,
            data: classs
        })
    }).catch(error => {
        console.error("获得所有班级异常", error);
        res.send({
            status: 1,
            msg: "获取所有班级异常,请稍后再试"
        })
    })
})

//获取班级列表
router.post('/manage/class/list', (req, res) => {
    let page = req.body.page || 1;
    let size = req.body.size || 5;
    let searchMap = req.body.searchMap || {};
    let obj = {};
    searchMap.teacher_id ? obj["teacher_id"] = searchMap.teacher_id : obj;
    searchMap.manager_id ? obj["manager_id"] = searchMap.manager_id : obj;

    ClassModel.find(obj).then(classs => {
        let count = classs.length
        ClassModel.find(obj).skip((page - 1) * parseInt(size)).limit(parseInt(size)).exec((err, data) => {

            res.send({
                status: 0,
                data: {
                    total: count,
                    data,
                }
            })
        })
    }).catch(error => {
        console.error('获取班级列表异常', error);
        res.send({
            status: 1,
            msg: '获取班级列表异常,请稍后再试！'
        })
    })
})

//添加班级
router.post('/manage/class/add', (req, res) => {
    //读取请求参数数据
    const {
        name
    } = req.body;
    // console.log(name);
    //处理:判断用户是否已经存在,如果存在返回错误信息,如果不存在保存
    //查询(根据username)
    ClassModel.findOne({name}).then(data => {
        if (data) {
            res.send({
                status: 1,
                msg: '此班级已存在'
            });
            return new Promise(() => {
            })
        } else {
            //没值(不存在)
            //保存
            return ClassModel.create({
                ...req.body,
            });
        }
    }).then(data => {
        //返回包含user的json数据
        res.send({
            status: 0,
            data: data
        })
    }).catch(error => {
        console.error('添加班级异常', error);
        res.send({
            status: 1,
            msg: '添加班级异常,请重新尝试'
        });
    })
})


//id查询班级
router.get('/manage/class/find', (req, res) => {
    const c = req.query;
    ClassModel.findById({
        _id: c._id
    }).then(data => {
        res.send({
            status: 0,
            data
        })
    }).catch(error => {
        console.error('根据id查询班级异常', error);
        res.send({
            status: 1,
            msg: '根据id查询班级异常,请重新尝试'
        })
    })
})

//提交修改数据接口
//更新班级
router.post('/manage/class/update', (req, res) => {
    const c = req.body
    ClassModel.findOneAndUpdate({
        _id: c._id
    }, c).then(oldclass => {
        const data = Object.assign(oldclass, c)
        res.send({
            status: 0,
            data
        })
    }).catch(error => {
        console.error('更新班级异常', error);
        res.send({
            status: 1,
            msg: '更新班级异常,请稍后再试！'
        })
    })
})

//删除班级
router.post('/manage/class/delete', (req, res) => {
    const {
        classId
    } = req.body;
    ClassModel.deleteOne({
        _id: classId
    }).then(doc => {
        res.send({
            status: 0
        })
    }).catch(error => {
        console.error('删除班级信息异常', error);
        res.send({
            status: 1,
            msg: '删除班级信息异常,请重新尝试'
        })
    })
})


//获取学员列表
router.post('/manage/student/list', (req, res) => {
    let page = req.body.page || 1
    let size = req.body.size || 5
    let searchMap = req.body.searchMap
    let obj = {}
    searchMap.name ? obj['name'] = searchMap.name : obj;
    searchMap.direction ? obj['direction'] = searchMap.direction : obj;
    searchMap.class ? obj['class'] = searchMap.class : obj;
    searchMap.teacher_id ? obj['teacher_id'] = searchMap.teacher_id : obj;
    searchMap.manager_id ? obj['manager_id'] = searchMap.manager_id : obj;
    StudentModel.find(obj).then(students => {
        let count = students.length
        StudentModel.find(obj).skip((page - 1) * parseInt(size)).limit(parseInt(size)).exec((err, data) => {
            res.send({
                status: 0,
                data: {total: count, data}
            })
        })
    }).catch(error => {
        console.error('获取学员列表异常', error);
        res.send({
            status: 1,
            msg: '获取学员列表异常,请稍后再试！'
        })
    })

})

//添加学员
router.post('/manage/student/add', (req, res) => {
    StudentModel.create({
        ...req.body
    }).then(data => {
        //返回包含user的json数据
        res.send({
            status: 0,
            data: data
        })

    }).catch(error => {
        console.error('添加学员异常', error);
        res.send({
            status: 1,
            msg: '添加学员异常,请重新尝试'
        })
    })
})


//根据id查询学员
router.get('/manage/student/find', (req, res) => {
    const student = req.query;

    // console.log(student._id);
    StudentModel.findById({
        _id: student._id
    }).then(data => {
        //返回包含user的json数据
        res.send({
            status: 0,
            data,
        })

    }).catch(error => {
        console.error('根据id查询学员异常', error);
        res.send({
            status: 1,
            msg: '根据id查询学员异常,请重新尝试'
        })
    })
})

//更新学员信息
router.post('/manage/student/update', (req, res) => {
    const student = req.body;
    StudentModel.findOneAndUpdate({
        _id: student._id
    }, student).then(oldStudent => {
        const data = Object.assign(oldStudent, student);

        //返回包含user的json数据
        res.send({
            status: 0,
            data: data
        })

    }).catch(error => {
        console.error('更新学员异常', error);
        res.send({status: 1, msg: '更新学员异常,请重新尝试'})
    })
})

//删除学员
router.post('/manage/student/delete', (req, res) => {
    const studentId = req.body.studentId;

    StudentModel.deleteOne({
        _id: studentId
    }).then(doc => {
        //返回包含user的json数据
        res.send({status: 0, msg: "删除学员成功",})

    }).catch(error => {
        console.error('删除学员异常', error);
        res.send({
            status: 1,
            msg: '删除学员异常,请重新尝试',
            error,
        })
    })
})



//校验原密码是否正确
router.post('/manage/user/pwd', function (req, res) {
    let body = req.body;
    UserModel.findOne({_id: body.userId, password: md5(body.password)}).then(user => {
        if (!user) {
            return res.send({
                status: 1,
                msg: '密码不正确!'
            })
        }
        return res.send({
            status: 0,
            date: user
        })
    })
})


//修改密码
router.put('/manage/user/pwd', function (req, res) {
    var id = req.body.userId;
    UserModel.findOne({
        _id: id
    }).then(user => {
        if (!user) {
            return res.send({
                status: 1,
                msg: '密码不正确!'
            })
        }
        user.password = md5(req.body.password)
        UserModel.findByIdAndUpdate(id, user).then(() => {
            return res.send({
                status: 0,
                msg: '修改密码成功!'
            })
        })
    })
})




//按年份查询学员数量
router.post('/manage/student/date', (req, res) => {
    let {year} = req.body;
    year = year + ""; //把年转换为字符串
    StudentModel.aggregate([{ //添加字段
        $project: {
            year: {$substr: ["$admission_date", 0, 4]}, //年份
            //$month取出$date字段中月份
            //$date_d的数据类型必须是date
            //month:{$month:"$date_d"}
            //$dateFromString把字符串转为日期
            //month
            month: {$substr: ["$admission_date", 5, 2]},},}, //鱼粉
        //匹配年份
        {$match: {year}},
        // 分组查询, 按月分组, count计算当月有多少条数据
        {$group: {_id: "$month", count: {$sum: 1},},}, //分组
        {$sort: {_id: 1}},//排序
    ]).exec((err, data) => {
        if(err){
            console.log('按年份查询异常',err)
            return res.send({status:1,msg:'按年份查询异常,请稍后再试'})
        }
        {
            return res.send({
                status: 0,
                data
            })
        }

    });
})



require('./file-upload')(router) //上传文件




module.exports = router