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
###2.角色管理树装控件bug
