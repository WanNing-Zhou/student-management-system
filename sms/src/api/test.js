import request from "@/utils/request";

export default {
    test() {
        request({
            url: '/',
            method: 'get'
        }).then(response => {
            console.log(response);
        })
    }
}