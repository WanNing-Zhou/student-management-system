import request from '../utils/request'

export default {

    getClassAll() {
        return request({
            url: '/manage/class/all',
            method: 'get'
        })
    },


    getClassList(page, size, searchMap) {
        return request({
            url: '/manage/class/list', //后端请求地址
            method: 'post', //请求方式
            data: {
                page,
                size,
                searchMap
            }
        })
    },

    add(classs) {
        return request({
            url: '/manage/class/add',
            method: 'post',
            data: classs
        })
    },


    getById(_id) {
        return request({
            url: `/manage/class/find?_id=${_id}`,
            method: 'get'
        })
    },

    update(classs) {
        return request({
            url: `/manage/class/update`,
            method: 'post',
            data: classs
        })
    },
    deleteById(classId) {
        return request({
            url: '/manage/class/delete', //后端请求地址
            method: 'post', //请求方式
            data: {
                classId
            }
        })
    }
}