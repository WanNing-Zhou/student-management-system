const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({

    name: {type: String, required: true}, //班级名称
    gender: {type: String, required: true}, //授课教师
    school: String,
    major: String,
    grade: String,
    education: String,
    direction: {type: String, required: true},
    id_number: String,
    phone: {type: String, required: true},
    parent: String,
    parent_phone: String, //家长联系电话
    address: String, //家庭住址
    qq: String,
    class: {type: String, required: true},
    admission_date: String, //入学时间
    teacher_id: {type: String, required: true},
    manager_id: {type: String, required: true},
    pictures: Array, //照片列表
    note: String, //备注

})

const StudentModel = mongoose.model('students',studentSchema)
module.exports = StudentModel
