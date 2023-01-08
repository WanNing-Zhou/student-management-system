/**
 * 能操作school集合数据的model
 */

//引入mogoose
const mongoose = require('mongoose');
//2.字义Schema
const majorSchema = new mongoose.Schema({
    majorname: {
        type: String,
        required: true
    }, //角色名称
})
//3.定义Model(与集合对应,可以操作集合)
const MajorModel = mongoose.model('majors', majorSchema);
module.exports = MajorModel;