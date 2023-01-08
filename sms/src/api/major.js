import request from '../utils/request'

export default {

    getMajorAll() {
        return request({
            url: '/manage/major/all',
            method: 'get'
        })
    },


    //获取专业列表
    getMajorList(page, size) {
        return request({
            url: '/manage/major/list', //后端请求地址
            method: 'post', //请求方式
            data: {
                page,
                size,
            }
        })
    },

    add(major) {
        return request({
            url: '/manage/major/add',
            method: 'post',
            data: major
        })
    },


    getById(_id) {
        return request({
            url: `/manage/major/find?_id=${_id}`,
            method: 'get'
        })
    },

    update(major) {
        return request({
            url: `/manage/major/update`,
            method: 'post',
            data: major

        })
    },
    deleteById(majorId) {
        return request({
            url: '/manage/major/delete', //后端请求地址
            method: 'post', //请求方式
            data: {
                majorId
            }
        })
    }
}