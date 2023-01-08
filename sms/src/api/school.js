import request from '../utils/request'

export default {

    getSchoolAll() {
        return request({
            url: '/manage/school/all',
            method: 'get'
        })
    },


    getSchoolList(page, size) {
        return request({
            url: '/manage/school/list', //后端请求地址
            method: 'post', //请求方式
            data: {
                page,
                size,
            }
        })
    },

    add(school) {
        return request({
            url: '/manage/school/add',
            method: 'post',
            data: school
        })
    },


    getById(_id) {
        return request({
            url: `/manage/school/find?_id=${_id}`,
            method: 'get'
        })
    },

    update(school) {
        return request({
            url: `/manage/school/update`,
            method: 'post',
            data: school
        })
    },
    deleteById(schoolId) {
        return request({
            url: '/manage/school/delete', //后端请求地址
            method: 'post', //请求方式
            data: {
                schoolId
            }
        })
    }
}