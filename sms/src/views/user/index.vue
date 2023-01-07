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
export default {
  name: "index",
  data(){
    return{
      users:[
        {
          "_id": "61516dc010fc422ded0eb207",
          "username": "jingjing",
          "name": "代静",
          "password": "827ccb0eea8a706c4c34a16891f84e7b",
          "phone": "13133333333",
          "role_id": "614441a3a8edad019bb0e114",
          "create_time": 1632726464736,
          "__v": 0
        },
        {
          "_id": "6151705a10fc422ded0eb213",
          "username": "renlong",
          "name": "任龙",
          "password": "81dc9bdb52d04dc20036dbd8313ed055",
          "phone": "13112345678",
          "role_id": "614442c3a8edad019bb0e134",
          "create_time": 1632727130430,
          "__v": 0
        }
      ],
      currentPage:1,//当前显示第多少页
      pageSize:5,//一页显示多少数据
      total:0,//总数据条数
    }

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
    }
  }
}
</script>

<style scoped>

</style>