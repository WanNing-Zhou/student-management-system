##项目中遇到的问题以及解决

###1.bodyParser被弃用(但还是可以用的,这个不是bug,自己开发的时候代码逻辑问题导致bug出现)

body-parser是非常常用的一个express中间件,作用是对post请求进行解析,使用非常简单
    
    app.use(bodyParser.json()); 
    app.use(bodyParser.urlencoded({ extended: false }));

bodyParser被弃用无法下载,express框架内部已经实现了对post参数的解析,现在只需要在const app = express()下面配置一下程序即可,不需要再单独下载一个包了

    const app = express()
    //app.use(bodyParser.urlencoded());
    app.use(express.json)
    app.use(express.urlencoded({extended:false}))

获取post参数方法依旧是req.body

    app.post('/post',(req,res)=>{
        res.send(req.body)
    })

###2.角色管理权限设置树状控件bug

**修复前**
    
    handleCheckChange(data, checked, indeterminate) {
      //如果选中则添加到menu数组中,如果取消勾选则从数组中删除
      if (checked) { //如果是选中
        this.checkedKeys.push(data.index); //将数据保存到checkedKeys中
      } else {
        this.checkedKeys.splice(this.checkedKeys.indexOf(data.index), 1)
      }
    }

**bug原因:** 学员选权限里由四个子权限, 当点击子权限的时候时首先的checked为false, data.index为/student, 
 然后才是采用checked为true表示选中, data.index为/student子选框的值
在checkedKey中并没有/student元素, 所以checkedKeys.indexOf(data.index)的返回值为-1,使用splice删除
元素的时候会删除掉末尾的元素,也就是说,当学员内子权限被第一次被选中的时候会将 保存权限数组的最后一条删除,

**修复后:**
        
    handleCheckChange(data, checked, indeterminate) {
      if (checked) { //如果是选中
        this.checkedKeys.push(data.index); //将数据保存到checkedKeys中
      } else {
        let deleteIndex = this.checkedKeys.indexOf(data.index);
        if(deleteIndex != -1){
          this.checkedKeys.splice(deleteIndex, 1)
        }
      }
    }

**bug原因** 角色权限的添加可能会出现角色权限重复的现象,将用户权限取消后,用户权限依然存在,
可以在前端对权限进行去重,

**修复后**

     handleCheckChange(data, checked, indeterminate) {
      //如果选中则添加到menu数组中,如果取消勾选则从数组中删除
      if (checked) { //如果是选中
        this.checkedKeys.push(data.index); //将数据保存到checkedKeys中
        let set = new Set(this.checkedKeys); //去重
        this.checkedKeys = Array.from(set);
      } else {
        let deleteIndex = this.checkedKeys.indexOf(data.index);
        if(deleteIndex !== -1){ //当删除的的权限,在权限数组中存在的时候才去删除
          this.checkedKeys.splice(deleteIndex, 1)
        }
      }
    }

###3.角色管理修改权限信息显示bug

**修复前**
  
    props:['role'],//从父组件那里接收一个角色对象
    mounted(){
      this.updateRole={...this.role} //为updateRole赋初始值
      this.authList = this.getAuthNodes(menuList)
      this.checkedKeys = this.role.menus  //初识权限列表
    // console.log('checkedKeys',this.checkedKeys)
    },

**bug原因**

因为角色管理页面内在权限修改的时候使用了自定义组件Auth,因为只会执行一次,使用
monunted函数也只会执行一次,因为mounted中使用父组件的角色对象赋值给当前组件的数据赋值
所以当父组件选中一行时roel发生改变,但是当前组件的数据没有改变

**修复后**
 
为当前组件添加一个监听器来监听父组件中role对象的变化,当role发生变化后,对当前组件的数据进行
更改

    watch:{
      role(val){ //当父组件role发生变化的时候需要改变当前显示的数据
        if(val){  //当权限成功修改后,父组件中将取消选中行,数据会为null,也会被监听器监听到,这一步防止空指针错误
          this.updateRole = {...val}
          this.checkedKeys = val.menus
          this.$refs['tree'].setCheckedKeys(this.checkedKeys)
        }
      }
    }

###4.分页效果bug

**bug描述:** 使用分页插件的时候,当删除最后一页的全部数据时,会产生空白页

**bug原因:** 当删除最后一页全部数据时,请求的仍是已经删除页的页码,所以后端返回的数据时空白的

**修复后** 

在请求分页数据前,加上这段代码,假如删除一条数据后,他会对当前页码进行判断,假如当前页码不存在的时候,给他赋值最后一页的页码

    if(this.currentPage > Math.ceil(this.totalPage)){
        this.currentPage = Math.ceil(this.totalPage)
    }

###5.权限bug

**bug描述:**  某一角色权限被修改,而角色处于登录状态使用系统,该角色的权限仍处于未改变状态

**bug原因**   角色权限没有实时的进行校验,导致正在登录的角色权限被改变时,仍能使用未改变时的权限功能

**修复后** 
 
给请求设置拦截器,在请求前先去当前角色权限,当权限未改变时才能正常使用功能,如果权限验证不通过需重新登录

    //请求拦截器
    request.interceptors.request.use(config => {
    //如果当前请求不是获取用户权限列表
      if (config.url != "/menus") { //对该路径的请求放行
      getMenus(); //权限验证功能
     }
     //请求拦截****
     return config;
     }, error => { 
      //出现异常,返回一个Promise的失败对象
     return Promise.reject(error)
     })
