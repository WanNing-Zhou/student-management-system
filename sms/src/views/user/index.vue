<template>
  <div>
    <el-table :data="users" style="width: 100%" height="380" border>
      <el-table-column label="序号" width="60" type="index"></el-table-column>
      <el-table-column label="用户名" width="180" prop="username"></el-table-column>
      <el-table-column label="姓名" width="180" prop="name"></el-table-column>
      <el-table-column label="电话号码" width="180" prop="phone"></el-table-column>
      <el-table-column label="创建时间" width="180" prop="create_time"></el-table-column>
      <el-table-column label="所属角色" width="180" prop="role_id"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="handleEdit( scope.row._id)">编辑
          </el-button>
          <el-button
              size="mini"
              type="danger"
              @click="handleDelete( scope.row._id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

<!--  分页控件    -->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>

  </div>
</template>

<script>
import userApi from '@/api/user'
export default {
  name: "index",
  data(){
    return{
      users:[],
      currentPage:1,//当前显示第多少页
      pageSize:5,//一页显示多少数据
      total:0,//总数据条数
    }
  },

  mounted() {
      this.fetchUser()
  },
  methods: {
    handleEdit(_id) {
      console.log("编辑",_id);
    },
    handleDelete(_id) {
      console.log("删除", _id);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize=val
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage=val
    },
    fetchUser(){
      userApi.getUserList(this.currentPage,this.pageSize).then(res=>{
        const resp = res.data
        if(resp.data==0){
          this.users = resp.data
        }
        // console.log("users:"+this.users)
      }).catch(err=>{

      })
    }
  }
}
</script>

<style scoped>

</style>