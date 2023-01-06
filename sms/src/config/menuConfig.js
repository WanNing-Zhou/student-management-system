const menuList = [{
    title: '首页', //菜单标题名称
    index: "/home", //对应的path
    icon: 'el-icon-s-home', //图标名称
    isPublic: true, //公开的
}, {
    title: "用户管理",
    index: '/user',
    icon: 'el-icon-user'
}, {
    title: '角色管理',
    index: '/role',
    icon: 'el-icon-medal',
}, {
    title: '学员',
    index: '/students',
    icon: 'el-icon-s-cooperation',
    children: [ //子菜单列表
        {
            title: '学校管理',
            index: '/school',
            icon: 'el-icon-office-building'

        }, {
            title: '专业管理',
            index: '/major',
            icon: 'el-icon-reading'
        }, {
            title: '班级管理',
            index: '/class',
            icon: 'el-icon-s-grid'
        }, {
            title: '学生管理',
            index: '/student',
            icon: 'el-icon-notebook-1'
        }
    ]
}]


export default menuList;