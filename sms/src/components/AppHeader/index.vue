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
    return {
      currentTime: formatDate(Date.now()),
      tem_day:'',
      tem_night:'',
      wea:'',
      wea_img:'',
      user: memoryUtils.user
    }
  },

  methods: {
    handleCommand(command) {
      this.$message('click on item ' + command)
    },
    getWeather() {
      reqWeather('哈尔滨').then(res => {
        const { tem_day,tem_night,wea,wea_img } = res;
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
        console.log('获取天气信息失败')
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
.date-weather{
  float: right;
  color: #fff;
  margin-right: 30px;
  font-size: 12px;
}


</style>