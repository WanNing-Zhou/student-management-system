<template>
  <div class="header">
    <a href="#">
      <img src="@/assets/logo.png" class="logo" width="25px" alt="图片加载异常">
      <span class="company">学员管理系统</span>
    </a>
    <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
                admin<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a" icon="el-icon-edit">修改密码</el-dropdown-item>
        <el-dropdown-item command="b" icon="el-icon-lollipop" >退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  data(){
    return {

    }
  },
  methods:{
    handleCommand(command){

    }
  }
}
</script>

<style scoped>
  /*图片样式*/
  .logo{
    vertical-align: middle;
    padding: 0 10px 0 40px;
  }

  /*名称样式*/
  .company{
    color: white;
    text-decoration: none;
    /*text-align: center;*/
    position: absolute;
  }

  /*控制下拉菜单的样式*/
  .el-dropdown{
    float: right;
    margin-right: 40px;
  }

  /*控制下拉菜单中的子元素样式*/
  .el-dropdown-link{
    color: white;
    cursor: pointer;
  }


</style>