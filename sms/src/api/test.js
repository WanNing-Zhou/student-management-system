import request from "@/utils/request";

export default {
    test(){
        request({
            url:'/test',
            methods:'get'
        }).then(res =>{
            console.log(res)
        })
    }
}