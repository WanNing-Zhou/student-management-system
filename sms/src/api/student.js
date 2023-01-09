import request from '@/utils/request';

export default {
    //图片删除
    reqDeleteImg(name) {
        return request({
            url: '/manage/img/delete',
            method: 'post',
            data: {
                name
            }
        })
    },

    //获取学员列表
    getStudentList(page, size, searchMap) {
        return request({
            url: '/manage/student/list', //后端请求地址
            method: 'post', //请求方式
            data: {
                page,
                size,
                searchMap
            }
        })
    },

    add(student) {
        return request({
            url: '/manage/student/add',
            method: 'post',
            data: student
        })
    },


    //根据id查询学员
    getById(_id) {
        // alert(_id);
        return request({
            url: `/manage/student/find?_id=${_id}`,
            method: 'get'
        })
    },

    update(student) {
        return request({
            url: `/manage/student/update`,
            method: 'post',
            data: student

        })
    },
    deleteById(studentId) {
        return request({
            url: '/manage/student/delete', //后端请求地址
            method: 'post', //请求方式
            data: {
                studentId
            }
        })
    },

    //根据年份查询当年每月学员数量
    getStudentListForMonth(year) {
        return request({
            url: '/manage/student/date',
            method: 'post',
            data: {
                year
            }

        })
    }

}