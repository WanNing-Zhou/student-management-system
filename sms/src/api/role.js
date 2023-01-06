import request from '@/utils/request'

export  default {
    getRoleList(){
        return request({
            url:'/manage/role/list',
            method:'get',
        })
    }
}