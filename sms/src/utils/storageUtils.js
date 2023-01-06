import store from 'store'
const USER_KEY = "user"
export default {
    //保存用户信息对象
    saveUser(user){
        store.set(USER_KEY,user)
        console.log('对象保存成功')
    },
    getUser(){
        //返回查询到的用户,如果没有用户返回一个空对象,防止报错
        return store.get(USER_KEY) || {}
    },

    //删除用户信息的方法
    removeUser(){
        store.remove(USER_KEY)
    }

}