##项目中遇到的问题以及解决
###1.bodyParser不能用

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
**修复前代**
    
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
