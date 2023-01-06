<template>
  <div class="header">
    <a href="#">
      <img src="@/assets/logo.png" class="logo" width="25px">
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
  .logo{
    vertical-align: middle;
    padding: 0 10px 0 40px;
  }

  .title{
    color: white;
    text-decoration: none;
    text-align: center;
  }

  .el-dropdown{
    float: right;
    margin-right: 40px;
  }

  .el-dropdown-link{
    color: white;
    cursor: pointer;
  }


</style>