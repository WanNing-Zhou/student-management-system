<template>
  <div class="login-container">

    <el-form :model="form" status-icon :rules="rules" ref="form" label-width="80px" class="login-form">
      <h2 class="login-title">登录</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
//@/zz/yy相当于src下的zz下的yy
import memoryUtils from "@/utils/memoryUtils";
import {login} from '@/api/login'
import  sotorageUtils from '@/utils/storageUtils'
export default {
  name: "index.vue",
  mounted() {
    // 登录页阻止回退
    sessionStorage.clear()
    history.pushState(null, null, document.URL)
    window.addEventListener(
        'popstate',
        function() {
          history.pushState(null, null, document.URL)
        },
        false
    )
  },

  data() {
    let validateUserName = (rule, value, callback) => {
      value = value.trim() //去除前后空格
      const length = value && value.length
      const pwdReg = /^[a-zA-Z0-9_]+$/  //正则
      if (value === "") {//如果输入的位空的话
        callback(new Error('请输入账号'))
      } else if (length < 4 || length > 12) { //账号长度要在4到12位之间
        callback(new Error('账号长度在4到12位之间'))
      } else if (!pwdReg.test(value)) {//如果不满足正则的话
        callback(new Error('账号必须由英文,数字或下划线组成'))
      } else {//如果上述全部通过
        callback();
      }
    }
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        //为用户名添加规则
        username: [
          {
            required: true,
            validator: validateUserName,
            trigger: ['blur', 'change']
          }
        ],//required 表示必须输入,validator 验证器 trigger:触发器 值为触发条件
        //为密码添加规则
        password: [
          {
            required: true,
            message: '请求输入密码',
            trigger: ['blur', 'change']
          }
        ]

      },
    };

  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(async (valid)=>{
        if(valid){
          // console.log(this.form.username,this.form.password)
          //发送请求
          let result = await login(this.form.username,this.form.password)
          if (result.data.status === 0){
            this.$message({
              message:'登录成功',
              type:"success"
            })
            const user = result.data.data
            // console.log('将信息存储到本地')
            sotorageUtils.saveUser(user)
            memoryUtils.user = user
            this.$router.replace("/")
          }
          // console.log(result)
        }else {
          // console.log("错误提交")
          return false;
        }
      })
    }
  }
}
</script>

<style scoped>

/*背景的样式*/
.login-container {
  position: absolute;
  width: 99%;
  height: 99%;
  background: url("../../assets/bg.png") no-repeat fixed center;
  background-size: 100% 100%;
  overflow: hidden;
}
/*表单样式*/
.login-form {
  width: 350px;
  margin: 160px auto;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 30px;
  border-radius: 20px;
}
/*标题样式*/
.login-title {
  text-align: center;
}
</style>