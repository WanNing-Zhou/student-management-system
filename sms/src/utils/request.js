import axios from "axios";
import memoryUtils from "@/utils/memoryUtils";
import storageUtils from "@/utils/storageUtils";
import {Loading, Message} from 'element-ui'

const request = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000, //请求超时
});

//获取最新权限列表
const getMenus = () => {
    if (memoryUtils.user.role_id) {
        const roleId = memoryUtils.user.role_id //当前登录用户的角色_id
        const userMeanus = memoryUtils.user.role.menus //当前登录用户的权限列表

        request({
            url: '/menus',
            method: 'post',
            data: {roleId}
        }).then(response => {
            const resp = response.data
            const {menus} = resp.data
            // console.log('memory',memoryUtils)
            // console.log('userMenus',userMeanus)
            // console.log('menus',menus)
            if (resp.status === 0) {
                if (userMeanus.length === menus.length) {
                    userMeanus.forEach(item => {
                        if (menus.indexOf(item) == -1) {
                            memoryUtils.user = {}
                            storageUtils.removeUser()
                            Message({
                                message: "当前用户权限被修改,请重新登录",
                                type: "wraning",
                            })
                            window.location.href="/login"

                        }
                    })
                }else{
                    memoryUtils.user = {}
                    storageUtils.removeUser()
                    Message({
                        message: "当前用户权限被修改,请重新登录",
                        type: "wraning",
                    })
                    window.location.href="/login"
                }
            }
        }).catch(err => {
            console.log(err);
            return
        })

    }
}

//loading效果
const loading = {
    loadingInstance: null, //loading实例
    open: function () {
        //打开加载
        if (this.loadingInstance === null) {
            //创建单例,防止切换路由重复加载
            this.loadingInstance = Loading.service({
                text: '正在加载中',
                target: '.main', //效果显示区域
                background: 'rgba(0,0,0,0.5)' //加载效果
            })
        }
    },
    close() {
        if (this.loadingInstance != null) {
            this.loadingInstance.close();
            // console.log('结束加载');
        }
        this.loadingInstance = null; //关闭实例后重新赋值null
    },
}

//请求拦截器
request.interceptors.request.use(config => {
    //如果当前请求不是获取用户权限列表
    if (config.url != "/menus") {
        getMenus();
        // console.log(config.url);
    }
    //请求拦截
    return config;
}, error => {
    //出现异常,返回一个Promise的失败对象
    return Promise.reject(error)
})


//响应拦截器
request.interceptors.response.use(response => {
    //将响应返回
    return response
}, error => {
    //出现异常,返回一个promise的失败对象
    return Promise.reject(error)
})


export default request;