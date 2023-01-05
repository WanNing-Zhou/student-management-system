<template>
  <div class="login-container">

    <el-form :model="form" status-icon :rules="rules" ref="form" label-width="80px" class="login-form">
      <h2 class="login-title">登录</h2>
      <el-form-item label="账号" prop="uername">
        <el-input  v-model="form.username" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password"  v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onsubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "index.vue",
  data(){
    return {
      form:{
        username:'',
        password:''
      },
      reules:{

      },
    };

  },
  methods:{
    onsubmit(){

    }
  }
}
</script>

<style scoped>

   /*背景的样式*/
  .login-container{
    position: absolute;
    width: 99%;
    height: 99%;
    background: url("../../assets/bg.png") no-repeat fixed center;
    background-size: 100% 100%;
    overflow: hidden;
  }

  .login-form{
    width: 350px;
    margin: 160px auto;
    background-color: rgba(255,255,255,0.8) ;
    padding: 30px;
    border-radius: 20px;
  }
  .login-title{
    text-align: center;
  }


</style>