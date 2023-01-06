<template>

  <div>
    <div class="btn_box" style="margin:20px 0">
        <el-button type="primary" @click="handleAdd">创建角色</el-button>
        <el-button type="primary" disabled>设置角色权限</el-button>
    </div>
    <el-table
        highlight-current-row
        @current-change="handleCurrentChange"
        :data="roleList"
        height="250"
        border
        style="width: 100%">
      <el-table-column
          type="index"
          label="序号"
          width="180">
      </el-table-column>
      <el-table-column
          property="name"
          label="角色名称"
          width="180">
      </el-table-column>
      <el-table-column
          property="creat_time"
          label="创建时间">
      </el-table-column>
      <el-table-column
          property="auth_time"
          label="授权时间">
      </el-table-column>
      <el-table-column
          property="auth_name"
          label="授权人">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import roleApi from '@/api/role'
export default {

  mounted() {
    this.fetchData()
  },
  name: "index",
  data(){
    return{
      currentRow: null,//选中的行
      roleList:[]
    }
  },
  methods:{
    handleAdd(){
    },
    handleCurrentChange(val){
      this.currentRow = val
    },
    fetchData(){
      roleApi.getRoleList().then(res=>{
        const resp = res.data
        console.log(resp)
        if(res.status===0){
          this.roleList = resp
        }
      })
    }
  }
}
</script>

<style scoped>

</style>