<template>
  <div>
    <div style="margin:10px" class="btn_box">
      <el-button margin-bottom="20px" type="primary" @click="handleAdd">添加学校</el-button>
    </div>

    <el-table :data="schools" height="380" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60">
      </el-table-column>
      <el-table-column prop="schoolname" label="学校名称">
      </el-table-column>

      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row._id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                   :page-sizes="[5, 10, 20, 50]" :page-size="pageSize" layout="total,sizes,prev,pager,next,jumper"
                   :total="total">
    </el-pagination>

    <!-- 新增/编辑用户窗口 -->
    <el-dialog title="学校编辑" :visible.sync="schoolFormVisible" width="500px">
      <!-- status-icon 当表单校验不通过时.输入框右侧有个x小图标 -->
      <!-- 这里有rules没有写 -->
      <el-form status-icon ref="schoolForm" :model="school" label-width="100px" lable-position="right"
               style="width:400px" :rules="rules">
        <el-form-item label="学校名称" prop="schoolname">
          <el-input v-model="school.schoolname" placeholder="请输入学校名称" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="schoolFormVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="school._id === null ? addData('schoolForm') : updateData('schoolForm')">
          确定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import schoolApi from "@/api/school";
export default {
  name: "School",
  mounted() {
    this.fetchSchool();
  },
  data() {
    return {
      schoolFormVisible: false,//编辑窗口是否展示
      schools: [],
      total: 0,//总记录数
      totalPage: 0,
      currentPage: 1,//当前页默认第一页
      pageSize: 5,//每页显示条数,5条
      school: {
        _id: null,
        schoolname: ""
      },
      rules: {
        schoolname: [{
          required: true,
          message: "学校名称必须输入",
          trigger: ["blur", "change"],
        }]

      }

    }
  },
  methods: {
    // 这三个还没有写完
    handleEdit(_id) {
      //清空数据
      this.handleAdd()
      schoolApi.getById(_id).then((response) => {
        const resp = response.data;
        if (resp.status === 0) {
          this.school = resp.data;
        }
      })
    },

    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          schoolApi.update(this.school).then((response) => {
            const resp = response.data;
            if (resp.status === 0) {
              this.fetchSchool()
              this.schoolFormVisible = false
              this.$message({
                type: "success",
                message: "更改学校成功"
              })
            }
          });
        } else {
          //验证不通过
          return false;
        }
      })
    },

    //点击删除
    handleDelete(id) {
      this.$confirm("确认删除这条记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //确认
        schoolApi.deleteById(id).then((response) => {
          const resp = response.data;
          if (resp.status === 0) {
            //提示信息
            this.$message({
              type: "success",
              message: "删除学校成功"
            });

            //更新总页数
            this.totalPage = (this.total - 1) / this.pageSize;
            //删除成功,刷新列表
            this.fetchSchool();
          }
        })
      }).catch(() => {
        //取消删除,不理会
      })
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchSchool();

    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchSchool();
    },

    //获取学校列表
    fetchSchool() {
      if(this.currentPage > Math.ceil(this.totalPage)){
        this.currentPage = Math.ceil(this.totalPage)
      }

      schoolApi.getSchoolList(this.currentPage, this.pageSize).then(response => {
        const res = response.data
        if (res.status === 0) {
          this.schools = res.data.data;
          this.total = res.data.total;
          this.totalPage = this.total / this.pageSize
        }
      })
    },

    addData(fromName) {
      this.$refs[fromName].validate((valid) => {
        if (valid) {
          //验证通过,提交添加
          // alert('add submit');
          schoolApi.add(this.school).then(response => {
            const res = response.data;
            if (res.status === 0) {
              this.$message({
                type: "success",
                message: "添加学校成功"
              });
              this.fetchSchool();
              this.schoolFormVisible = false;//关闭窗口
            }
          })
        } else {
          //验证不通过
          return false;
        }
      })
    },

    handleAdd() {
      this.school = {
        _id: null,
        schoolname: ""
      };
      this.schoolFormVisible = true;
      this.$nextTick(() => {
        this.$refs['schoolForm'].resetFields();
      })
    }

  }
}
</script>

<style scoped>

</style>