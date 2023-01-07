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
    }
}


