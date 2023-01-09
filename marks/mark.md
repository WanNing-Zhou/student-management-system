## 项目中遇到的问题以及解决

### 1.bodyParser被弃用(但还是可以用的,这个不是bug,自己开发的时候代码逻辑问题导致bug出现)

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

### 2.角色管理权限设置树状控件bug

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

### 3.角色管理修改权限信息显示bug

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

### 4.分页效果bug

**bug描述:** 使用分页插件的时候,当删除最后一页的全部数据时,会产生空白页

**bug原因:** 当删除最后一页全部数据时,请求的仍是已经删除页的页码,所以后端返回的数据时空白的

**修复后** 

在请求分页数据前,加上这段代码,假如删除一条数据后,他会对当前页码进行判断,假如当前页码不存在的时候,给他赋值最后一页的页码

    if(this.currentPage > Math.ceil(this.totalPage)){
        this.currentPage = Math.ceil(this.totalPage)
    }

### 5.权限bug

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

### 6.页面回退bug

**bug等级:** 

可以说是非常严重

**bug描述** 

当用户使用了本系统,退出登录,并重新登陆后,可以访问到退出前的页面,如果是权限发生改变的时候,可以通过回退访问到因权限修改退出前的页面

**修复后**

js本身是无法禁止页面回退的，但是我们可以通过一些特殊操作来达到这个效果，我们主要用到：
为浏览器加一个当前网址的历史记录，这样当点击回退时，就会回到当前页面，相当于没回退，然后给用户的感觉就是没有回退

    window.history.pushState(null, null, document.URL);

首先我们需要在刚进入页面时在浏览器历史记录中加一条当前页面的记录，入上代码，
另外我们需要监听页面后退，在页面后退的回调方法中再加一条当前网址的历史记录，为什么呢？
当我们回退成功后，如果不加历史记录，那么再次回退时，就回退到了之前的历史记录了，所谓的禁止回退的效果就失效了，所以我们需要在回退的回调函数内加一条历史记录，防止下一次回退会真正的回退到之前的记录，
这样循环往复，我们点击回退，永远都会停留在当前页面，从而造成禁止浏览器回退的假象。
监听浏览器回退的方法：

      window.addEventListener('popstate', this.popstateFun,false);

popstateFun方法

    popstateFun(){
      //监听浏览器回退的回调
      window.history.pushState(null, null, document.URL); //想浏览器跳转记录中添加一条空记录
    }


### 7.班级管理搜索bug

**bug描述**

班级管理按条件查询的时候,如果查询的是不存在的教师或者学管的姓名,就会返回全部信息

**修复前**
    
    searchData() {
      this.currentPage = 1;
      const resTeacher = this.userAll.find(item => item.name === this.search.teacher) || {}; //根据姓名找到教师对象
      const resManager = this.userAll.find(item => item.name === this.search.manager) || {};//根据姓名找到学管对象
      this.searchMap.teacher_id = resTeacher._id || ""; 
      this.searchMap.manager_id = resManager._id || "";
      this.fetchClasss(); //这个方法会发送请求,携带searchMap作为请求体
    },

**bug原因**

前端对教师/学管根据姓名匹配对应的id,如果匹配失败就会赋值为空,后端在相应请求的时候,如果学管id和教师id为空的话,会默认返回全部

**修复后**

    searchData() {
      this.currentPage = 1;
      const resTeacher = this.userAll.find(item => item.name === this.search.teacher) || {}; //根据姓名找到教师对象
      const resManager = this.userAll.find(item => item.name === this.search.manager) || {};//根据姓名找到学管对象
      this.searchMap.teacher_id = resTeacher._id || "null"; //获取id如果不存在,赋值"null"
      this.searchMap.manager_id = resManager._id || "null";//获取id如果id不存在,赋值为"null"
      this.fetchClasss(); //这个方法会发送请求,携带searchMap作为请求体
    },

### 8.图片删除bug

**bug描述**

添加学员的图片删除操作,当删除第一张图片的时候,第二张图片无法删除,


**修复前**

    handleRemove(file) { //删除功能
      studentApi.reqDeleteImg(file.name).then(response => {
        const res = response.data;
        if (res.status === 0) {
          this.fileList.splice(
              this.fileList.indexOf(file.name), 1); //根据文件的索引删除一张片
        }
      })
    },

**bug原因**

使用elementUI的时候,会将图片保存在filelist中,但filelist保存的是图片对象,在查找的时候返回值为-1
所以导致bug

**修复后**

     handleRemove(file) { //删除功能
      studentApi.reqDeleteImg(file.name).then(response => {
        const res = response.data;
        if (res.status === 0) {
          this.fileList.splice(
              this.fileList.indexOf(file), 1); //根据文件的索引删除一张片
        }
      })
    },







