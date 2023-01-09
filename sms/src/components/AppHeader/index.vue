<template>
  <div class="header">
    <a href="#">
      <img src="@/assets/logo.png" class="logo" width="25px" alt="图片加载异常">
      <span class="company">学员管理系统</span>
    </a>
    <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
                {{ user.username }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a" icon="el-icon-edit">修改密码</el-dropdown-item>
        <el-dropdown-item command="b" icon="el-icon-lollipop" @click="handleLogout">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <span class="date-weather">
              <span class="date-weather">
            <span class="date">{{ currentTime }}</span>
            &nbsp;&nbsp;|&nbsp;&nbsp;
                <span class="weather">
                  <i :class="wea_img"></i>
                  &nbsp;&nbsp;{{ wea }}&nbsp;&nbsp;{{ tem_day }}/{{ tem_night }}C&deg;
                </span>
        </span>
    </span>


    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="userForm" status-icon :rules="rules" ref="userForm" label-width="100px"
               style="width:400px">
        <el-form-item label="原密码" prop="oldPass">
          <el-input type="password" v-model="userForm.oldPass"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="userForm.pass"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="userForm.checkPass"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('userForm')">提交</el-button>
          <el-button @click="$refs['userForm'].resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


  </div>
</template>

<script>
import {reqWeather} from "@/api/jsonp";
import {formatDate} from "@/utils/dateUtils";
import memoryUtils from "@/utils/memoryUtils";
import storageUtils from "@/utils/storageUtils";
import userApi from "@/api/user";

export default {


  data() {
    const validateOldPass = (rule, value, callback) => {
      userApi.checkPwd(this.user._id, value).then(response => { //触发条件成立,就会向后端发送请求,检验原密码是否正确
        const res = response.data
        if (res.status === 0) {
          callback()
        } else {
          callback(new Error(res.msg))
        }
      })
    }
    const validatePass = (rule, value, callback) => {
      if (value != this.userForm.pass) {
        callback(new Error('两次密码输入不一致!'))
      } else {
        callback();
      }
    }
    return {
      dialogFormVisible:false,
      currentTime: formatDate(Date.now()),
      tem_day: '',
      tem_night: '',
      wea: '',
      wea_img: '',
      user: memoryUtils.user,
      userForm: {
        oldPass: "",
        pass: "",
        checkPass: ""
      },
      rules: {//自定义校验规则
        oldPass: [
          {required: true, message: '旧密码不能为空', trigger: 'blur'},
          {validator: validateOldPass, trigger: 'blur'}
        ],
        pass: [
          {required: true, message: '新密码不能为空', trigger: 'blur'}
        ],
        checkPass: [
          {required: true, message: '确认密码不能为空', trigger: 'blur'},
          {validator: validatePass, trigger: 'change'}
        ]
      },
    }
  },

  methods: {
    handleCommand(command) {
      switch (command) {
        case "a":
          this.handlePwd();
          break;
        case "b":
          this.handleLogout();
          break;
        default:
          break;
      }
    },

    handlePwd() { //更改密码
      this.dialogFormVisible = true;  //弹窗可见
      this.$nextTick(() => {
        this.$refs['userForm'].resetFields();//将弹窗内输入框清空
      })
    },

    submitForm(formName) { //提交更改密码表单
      this.$refs[formName].validate(valid => {
        if (valid) {
          userApi.updatePwd(this.user._id, this.userForm.checkPass).then(response => {
            const res = response.data
            this.$message({
              message: res.msg,
              type: res.status === 0 ? 'success' : 'warning'
            })
            if (res.status === 0) {
              this.handleLogout()
              this.dialogFormVisible = false
            }
          })
        } else {
          return false
        }
      })
    },


    getWeather() {
      reqWeather('哈尔滨').then(res => {
        const {tem_day, tem_night, wea, wea_img} = res;
        const weaImgs = { //天气图标
          xue: 'el-icon-light-rain',
          lei: 'el-icon-lightning',
          shachen: 'el-icon-sunrise',
          wu: 'el-icon-cloudy-and-sunny',
          bingbao: 'el-icon-light-rain',
          yun: 'el-icon-cloudy',
          yu: 'el-icon-heavy-rain',
          yin: 'el-icon-partly-cloudy',
          qing: 'el-icon-sunny'
        }
        this.tem_day = tem_day;
        this.tem_night = tem_night;
        this.wea = wea;
        this.wea_img = weaImgs[wea_img]; //使用[]来获取图标值


      }).catch((err) => {
        // console.log('获取天气信息失败')
      })
    },
    getTime() {
      setInterval(() => {
        this.currentTime = formatDate(Date.now())

      }, 1000)
    },


    handleLogout() { //退出功能
      memoryUtils.user = {};
      storageUtils.removeUser();
      this.$router.replace("/login");
      this.$message({
        type: 'success',
        message: '退出成功'
      })
    },

  }, mounted() {
    this.getTime()
    this.getWeather()
  },
}
</script>

<style scoped>
/*图片样式*/
.logo {
  vertical-align: middle;
  padding: 0 10px 0 40px;
}

/*名称样式*/
.company {
  color: white;
  text-decoration: none;
  /*text-align: center;*/
  position: absolute;
}

/*控制下拉菜单的样式*/
.el-dropdown {
  float: right;
  margin-right: 40px;
}

/*控制下拉菜单中的子元素样式*/
.el-dropdown-link {
  color: white;
  cursor: pointer;
}

/*时间天气样式*/
.date-weather {
  float: right;
  color: #fff;
  margin-right: 30px;
  font-size: 12px;
}


</style>