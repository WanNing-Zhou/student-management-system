/**
 * 能操作school集合数据的model
 */

//引入mogoose
const mongoose = require('mongoose');
//2.字义Schema
const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, //班级名称
    teacher_id: {
        type: String,
        required: true
    }, //授课教师
    manager_id: {
        type: String,
        required: true
    }, //学管id
    stage: {
        type: String,
        required: true,
    }
})
//3.定义Model(与集合对应,可以操作集合)
const ClassModel = mongoose.model('classs', classSchema);
module.exports = ClassModel;