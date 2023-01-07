import request from "@/utils/request";

export default {

    //获取所有用户
    getUserAll(){
        return request({
            url:'/manage/user/all',
            method:'get'
        })
    },
    //获取用户列表(分页)
    getUserList(page,size){
        return request({
            url:'/manage/user/list',
            method:'post',
            data:{
                page,
                size
            }
        })
    },

    //添加用户
    add(user){
        return request({
            url:'/manage/user/add',
            method:'post',
            data:user
        })
    },

    //根据id查询用户
    getById(_id){
        return request({
            url:`/manage/user/find?_id=${_id}`,
            method:'get'
        })
    },

    //更新用户数据
    update(user){
        return request({
            url:'/manage/user/update',
            method:'post',
            data:user
        })
    },

    //删除角色
    deleteById(userId) {
        return request({
            url: '/manage/user/delete', //后端请求地址
            method: 'post', //请求方式
            data: {
                userId
            }
        })
    },

}


