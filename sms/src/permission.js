import router from "@/router/index";
import memoryUtils from "@/utils/memoryUtils";


//路由守卫
router.beforeEach((to,form,next)=>{
    //获取user信息,如果存在则代表已经登录过
    const user = memoryUtils.user
    // console.log(memoryUtils.user)
    if (user && user._id){//如果用户信息存在
        if(to.path === '/login'){ //如果要去login页面则直接跳转到/页面
            console.log('拦截成功')
            next({path:'/'})
        }else { //如果是其他页面就会放行
            next()
        }
    }else{//如果用户西悉尼不存在,则代表没有登录过
        if(to.path === '/login'){ //如果是去登录页面就放行
            next()
        }else{
            //如果将要跳转的是非登录也页面,则会去登录页面进行登录
            next({path:'/login'})
        }
    }
})
