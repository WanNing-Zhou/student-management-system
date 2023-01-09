<template>
    <div>
      <div class="EchartPractice">
        <h1 class="home_title">
          <el-button :disabled="preYearDisabled"  type="primary" icon="el-icon-arrow-left" @click="getPreYearDate">上一年</el-button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span>{{ year }}</span><span>年学员数量</span>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <el-button :disabled="nextYearDisabled" type="primary" @click="getNextYearDate">下一年
            <i class="el-icon-arrow-right el-icon--right"></i>
          </el-button>
        </h1>
        <div id="main"></div>
      </div>

    </div>
</template>

<script>
import studentApi from "@/api/student";

export default {
  name: "index",
  data(){
    return{
      year:2022,
      nowYear:2022,
      preYearDisabled:false,
      nextYearDisabled:false,
    }
  },
  mounted() {
    this.drawChart()
    this.getThisYear()
  },
  methods:{
    drawChart(){

      studentApi.getStudentListForMonth(this.year).then(response=>{
        const resp = response.data
        if(resp.status === 0){
          let chartDom = document.querySelector('#main');
          let myChart = this.$echarts.init(chartDom);
          let option;
          let dataArr = [0];
          //如果当前年有数据则显示,,没有则提示无此年数据
          if (resp.data && resp.data.length) {

            resp.data.forEach(element => {
              dataArr[element._id - 1] = element.count;
            });


          } else {
            this.$message({
              message: "当前年份无数据",
              type: "warning",
              suration: 5000,//停留时长
            })
          }


          option = {
            xAxis: {
              type: 'category',
              data: [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月",
              ]
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                data: dataArr,
                type: 'bar'
              }
            ]
          };

          option && myChart.setOption(option);


        }
      })

    },
    getThisYear(){
      let date = new Date(Date.now())
      this.nowYear = Number.parseInt(date.getFullYear())
      this.year = this.nowYear

    },
    getPreYearDate(){
      this.year--;
      this.drawChart();
    },

    getNextYearDate(){
      this.year++;
      this.drawChart();
    },
  },
  watch:{
    year(val){
       if(val>=this.nowYear){
         this.nextYearDisabled = true
       }else {
         this.nextYearDisabled = false
       }
       if (val<=2019){
         this.preYearDisabled = true
       }else{
         this.preYearDisabled =false
       }
    },
  }
}
</script>

<style scoped>

  #main{
    width: 100%;
    height: 70vh;
    margin: 100px auto 0;

  }

  .home_title {
    text-align: center;
  }

  .home_title span {
    vertical-align: bottom;
  }

</style>