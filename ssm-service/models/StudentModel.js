const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({

    name: {type: String, required: true}, //班级名称
    gender: {type: String, required: true}, //授课教师
    school: {type:String},
    major: {type:String},
    grade: {type:String},
    education: {type:String},
    direction: {type: String, required: true},
    id_number: {type:String},
    phone: {type: String, required: true},
    parent: {type:String},
    parent_phone: {type:String}, //家长联系电话
    address:{type:String} , //家庭住址
    qq: {type:String},
    class: {type: String, required: true},
    admission_date: {type:String}, //入学时间
    teacher_id: {type: String, required: true},
    manager_id: {type: String, required: true},
    pictures:{type:Array}, //照片列表
    note:{type:String}, //备注

})

const StudentModel = mongoose.model('students',studentSchema)
module.exports = StudentModel
