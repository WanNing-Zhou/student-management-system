
<script>

/**
 * vue动态创建标签,
 * 使用jsx语法,利用render函数进行渲染
 */


import menuList from "@/config/menuConfig.js";
import memoryUtils from '@/utils/memoryUtils';

export default {
  data() {
    return {
      menuNodes: "",//用来存储所有菜单项
    }
  },
  mounted() {
    this.menuNodes = this.getMenuNodes(menuList);
  },
  render() {
    return (
        <div class="navbar">
          <el-menu
              router={true}  //开启路由模式
              default-active={this.$route.path} //路由地址
              default-openeds={["/students"]}//默认展开students
              class="el-menu-vertical-demo"
              background-color='#545c64' //背景颜色
              text-color='#fff' //文本颜色
              active-text-color='#ffd04b'  //选中颜色
          >
            {this.menuNodes}
          </el-menu>
        </div>
    )
  },

  components: {},

  methods: {
    hasAuth(item) {
      const { index, isPublic } = item;
      //当前登录用户的权限列表
      const menus = memoryUtils.user.role.menus;
      const username = memoryUtils.user.username;
      /**
       * 1.如果当前用户admin:全部通过
       * 2.如果当前item是公开的
       * 3.当前用户有此item的权限:index是否在menus中
       */
      if (username === 'admin' || isPublic || menus.indexOf(index) !== -1) {
        return true;
      } else if (item.children) {
        //4.如果当前用户有此item的某个自item的权限
        //查看当前item的子节点中的index时候在用户权限列表中存在.find方法,会返回对应的元素,但是需要的是布尔值,所以两次取反强制转换

        return !!item.children.find(child => menus.indexOf(child.index) !== -1)
      }
      return false;
    },

    //根据导航菜单配置文件生成菜单项
    getMenuNodes(menuList) {
      return menuList.map((item) => {
        //如果角色由这个权限
        if (this.hasAuth(item)) {
          //没有子菜单
          if (!item.children) {
            return (<el-menu-item
                index={item.index}
            >
              <i class={item.icon}></i>
              <span slot="title">{item.title}</span>
            </el-menu-item>)
          } else { //由子菜单,利用递归将菜单进行渲染
            return (
                <el-submenu
                    index={item.index}>
                  <template slot="title">
                    <i class={item.icon}></i>
                    <span>{item.title}</span>
                  </template>
                  {this.getMenuNodes(item.children)}
                </el-submenu>
            )
          }
        }
      })
    },
  }
}
</script>

<style scoped>
/*取消边框*/
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: 0;
}
</style>