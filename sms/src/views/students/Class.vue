<template>
  <div>
    <!-- 条件查询,inline属性设置表单变为行内的表达域 -->
    <el-form ref="searchForm" :inline="true" :model="search" style="margin:10px">
      <!--有prop才可以重置 -->
      <el-form-item prop="teacher">
        <el-input v-model="search.teacher" placeholder="根据教师查询" style="width:200px">
        </el-input>
      </el-form-item>
      <el-form-item prop="manager">
        <el-input v-model="search.manager" placeholder="根据学管查询" style="width:200px">
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="searchData">查询</el-button>
        <el-button icon="el-icon-edit" type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>

    </el-form>

    <!-- 列表 -->
    <el-table :data="classs" height="380" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60">
      </el-table-column>
      <el-table-column prop="name" label="班级名称">
      </el-table-column>
      <el-table-column prop="teacher_id" label="授课教师" :formatter="formatTeacher">
      </el-table-column>
      <el-table-column prop="manager_id" label="学管" :formatter="formatManager">
      </el-table-column>
      <!-- 课程阶段 -->
      <el-table-column prop="stage" label="课程阶段">
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row._id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                   :page-sizes="[5, 10, 20, 50]" :page-size="pageSize" layout="total,sizes,prev,pager,next,jumper"
                   :total="total">
    </el-pagination>

    <!-- 添加或编辑班级    -->
    <el-dialog title="添加/编辑班级" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="updateClass" status-icon ref="classForm" label-width="100px" label-position="right"
               style="width:400px" :rules="rules">
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="updateClass.name"></el-input>
        </el-form-item>
        <el-form-item label="授课教师" prop="teacher_id">
          <el-select v-model="updateClass.teacher_id" class="filter-item" placeholder="请点击选择">
            <el-option v-for="option in teacherOptions" :key="option._id" :label="option.name"
                       :value="option._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学管" prop="manager_id">
          <el-select v-model="updateClass.manager_id" class="filter-item" placeholder="请点击选择">
            <el-option v-for="option in managerOptions" :key="option._id" :label="option.name"
                       :value="option._id">
            </el-option>

          </el-select>

        </el-form-item>
        <el-form-item label="课程阶段" prop="stage">
          <el-input v-model="updateClass.stage" placeholder="请填写课程阶段"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="updateClass._id === null ? addData('classForm') : updateData('classForm')">
          确 定
        </el-button>
      </div>

    </el-dialog>


  </div>
</template>

<script>

import classsApi from "@/api/classs";
import userApi from "@/api/user";
import roleApi from "@/api/role";

export default {

  name: "Class",
  mounted() {
    this.fetchClasss();
    this.getUserList();
    this.getAllRole();
  },
  data() {
    return {
      roles:[],//用来存储角色
      teacherId:'',
      managerId:'',
      classs: [],
      total: 0,//总记录数
      totalPage: 1,
      currentPage: 1,//当前页默认第一页
      pageSize: 5,//每页显示条数,5条
      updateClass: {
        _id: null,
        name: "",
        teacher_id: '',
        manager_id: '',
        state: "",
      },
      //收集表单内容
      search: {
        teacher: "", //存储搜索内的教师信息
        manager: '' //存储搜索内的学管信息
      },
      //查询条件对象
      searchMap: {
        teacher_id: '',
        manager_id: '',
      },
      userAll: [],
      teacherOptions: [],//教师列表
      managerOptions: [],//学管列表
      //校验规则
      rules: {
        name: [{
          required: true,
          message: "班级名称必须输入",
          trigger: ["blur", "change"],
        }],
        teacher_id: [{
          required: true,
          message: "请选择教师",
          trigger: ["blur", "change"],
        }],
        manager_id: [{
          required: true,
          message: "教师必须填写",
          trigger: ["blur", "change"],
        }],
        stage: [{
          required: true,
          message: "课程阶段必须填写"
        }]
      },
      dialogFormVisible: false,//添加/编辑班级弹窗是否显示
    }
  },



  methods: {

    getAllRole(){
      roleApi.getRoleList().then(response=>{
        const resp = response.data
        resp.data.forEach(item=>{
          if(item.name==="教师")
            this.teacherId = item._id
          if (item.name==="学管")
            this.managerId = item._id
        })

      })
    },


    searchData() {
      if(this.search.teacher===''&&this.search.manager===''){ //如果查询条件为空的话返回全部
        this.fetchClasss(); //这个方法会发送请求,携带searchMap作为请求体
        return
      }
      this.currentPage = 1;
      const resTeacher = this.userAll.find(item => item.name === this.search.teacher) || {}; //根据姓名找到教师对象
      const resManager = this.userAll.find(item => item.name === this.search.manager) || {};//根据姓名找到学管对象
      this.searchMap.teacher_id = resTeacher._id || "null"; //获取id如果不存在,赋值"null"
      this.searchMap.manager_id = resManager._id || "null";//获取id如果id不存在,赋值为"null"
      this.fetchClasss(); //这个方法会发送请求,携带searchMap作为请求体
    },


    resetForm(formName) {
      this.$refs[formName].resetFields();
    },


    handleEdit(_id) {
      //清空数据
      this.handleAdd()
      classsApi.getById(_id).then((response) => {
        const resp = response.data;
        if (resp.status === 0) {
          this.updateClass = resp.data;
        }
      })
    },

    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          classsApi.update(this.updateClass).then((response) => {
            const resp = response.data;
            if (resp.status === 0) {
              this.fetchClasss();
              this.dialogFormVisible = false;
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
        classsApi.deleteById(id).then((response) => {
          const resp = response.data;

          if (resp.status === 0) {
            //提示信息
            this.$message({
              type: "success",
              message: "删除班级成功"
            });
            //更新总页数
            this.totalPage = (this.total - 1) / this.pageSize;
            //删除成功,刷新列表
            this.fetchClasss();
          }
        })
      }).catch(() => {

        //取消删除,不理会
      })
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchClasss();

    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchClasss();

    },

    //获取学校列表
    fetchClasss() {
      if(this.currentPage > Math.ceil(this.totalPage)){
        this.currentPage = Math.ceil(this.totalPage)
      }
      this.getAllRole();
      classsApi.getClassList(this.currentPage, this.pageSize, this.searchMap).then(response => {
        const res = response.data

        if (res.status === 0) {
          this.classs = res.data.data;
          this.total = res.data.total;
          this.totalPage = this.total / this.pageSize
        }
      })
      // console.log('s', this.searchMap);
    },
    //获取所有用户列表
    getUserList() {
      userApi.getUserAll().then((response) => {
        const res = response.data;
        // console.log("获取所有用户列表", res);
        if (res.status === 0) {
          this.userAll = res.data;
          this.userAll.map(item => {
            if (item.role_id === this.teacherId) { //判断是否时教师
              this.teacherOptions.push(item);
            } else if (item.role_id === this.managerId) { //判断是否是学管
              this.managerOptions.push(item);
            }
          })
        }
      });
    },
    //此方法用于格式化表格中展示教师数据
    formatTeacher(roe, column, cellValue, index) {
      const teacher = this.userAll.find((item) => item._id === cellValue) || {};
      return teacher.name;
    },
    //此方法用于格式化表格中展示教师数据
    formatManager(roe, column, cellValue, index) {

      const manager = this.userAll.find((item) => item._id == cellValue) || {};
      return manager.name;
    },


    addData(fromName) {
      this.$refs[fromName].validate((valid) => {
        if (valid) {
          //验证通过,提交添加
          classsApi.add(this.updateClass).then(response => {
            const res = response.data;
            if (res.status === 0) {
              this.fetchClasss();
              this.dialogFormVisible = false;//关闭窗口
            } else {
              //失败，弹出提示
              this.$message({ message: res.msg, type: "warning" });
              // console.log(res);
            }
          })
        } else {
          //验证不通过
          return false;
        }
      })
    },

    handleAdd() {
      this.updateClass = {
        _id: null,
        name: "",
        teacher_id: '',
        manager_id: '',
        stage: ''
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['classForm'].resetFields()
      })
    },
  }
}
</script>

<style scoped>

</style>