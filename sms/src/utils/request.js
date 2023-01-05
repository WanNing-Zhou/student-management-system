import axios from "axios";

const request = axios.create({
    baseURL:'/',
    timeout:5000
})


//请求拦截器
request.interceptors.request.use(config=>{
    //请求拦截
    return config;
},error => {
    //出现异常,返回一个Promise的失败对象
    return Promise.reject(error)
})


//响应拦截器
request.interceptors.response.use(response=>{
    //将响应返回
    return response
},error=>{
    //出现异常,返回一个promise的失败对象
    return Promise.reject(error)
})


export default request;