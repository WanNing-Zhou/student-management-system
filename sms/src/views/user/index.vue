<template>
  <div>
    <div style="margin:10px" class="btn_box">
      <el-button margin-bottom="20px" type="primary" @click="handleAdd">新增用户</el-button>
    </div>

    <el-table :data="users" style="width: 100%" height="580" border>
      <el-table-column label="序号" width="60" type="index"></el-table-column>
      <el-table-column label="用户名" width="180" prop="username"></el-table-column>
      <el-table-column label="姓名" width="180" prop="name"></el-table-column>
      <el-table-column label="电话号码" width="180" prop="phone"></el-table-column>
      <el-table-column label="创建时间" width="180" prop="create_time" :formatter="resetDate"></el-table-column>
      <el-table-column label="所属角色" width="180" prop="role_id" :formatter="formatRole"></el-table-column>

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
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        layout="total,sizes,prev,pager,next,jumper"
        :total="total"
    >
    </el-pagination>
    <!--    添加/编辑 弹窗-->

    <el-dialog :title="user._id === null ? '用户添加': '用户编辑'" :visible.sync="userFormVisible" width="500px">
      <!-- status-icon 当表单校验不通过时.输入框右侧有个x小图标 -->
      <!-- 这里有rules没有写 -->
      <el-form status-icon ref="userForm" :model="user" label-width="100px" lable-position="right"
               style="width:400px" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username" placeholder="请输入用户名"/>
        </el-form-item>

        <!--        <el-form-item label="密码" prop="password" v-if="user._id === null ? true : false">-->
        <el-form-item label="密码" prop="password">
          <el-input v-model="user.password" type="password" placeholder="请输入用户名"/>
        </el-form-item>

        <el-form-item label="姓名" prop="name">
          <el-input v-model="user.name" placeholder="请输入姓名"/>
        </el-form-item>

        <el-form-item label="角色" prop="role_id">
          <el-select v-model="user.role_id" class="filter-item" placeholder="请点击选择">
            <el-option v-for="option in roleOptions" :key="option._id" :label="option.name"
                       :value="option._id"/>
          </el-select>
        </el-form-item>

        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="user.phone" placeholder="请输入手机号"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="user._id === null ? addData('userForm') : updateData('userForm')">确 定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import userApi from '@/api/user'
import {formatDateNoTime} from "@/utils/dateUtils";

export default {
  name: "index",
  data() {

    //自定义校验规则(用户名)
    let validateUserName = (rule, value, callback) => {
      value = value.trim();
      const length = value && value.length;
      const pwdReg = /^[a-zA-Z0-9_]+$/;
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (length < 4 || length > 12) {
        callback(new Error("长度在4到12个字符"));
      } else if (!pwdReg.test(value)) {
        callback(new Error("账号必须是英文,数字或下划线组成"));
      } else {
        callback();
      }
    };

    let validatePhone = (rule, value, callback) => {
      value = value.trim();
      const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
      if (value === "") {
        callback(new Error("请输入手机号码"));
      } else if (!phoneReg.test(value)) {
        callback(new Error("请输入正确的手机号码"));
      } else {
        callback();
      }
    };

    return {
      roleOptions: [],//下拉列表数据
      userFormVisible: false,//添加/编辑窗口是否展示
      users: [],//用户数据列表
      currentPage: 1,//当前显示第多少页
      pageSize: 5,//一页显示多少数据
      total: 0,//总数据条数
      totalPage: 0,
      user: {
        _id: null,
        username: '',
        password: '',
        name: '',
        role_id: '',
        phone: ''

      },//添加或编辑的用户对象
      rules: {
        username: [
          {
            required: true,
            validator: validateUserName,
            trigger: ["blur", "change"],
          }
        ],
        password: [{required: true, message: "密码不能为空", trigger: "blur"}, {
          min: 4, message: "密码长度需大于等于4", trigger: "blur"
        },],
        role_id: [
          {
            required: true,
            message: '请选择角色',
            trigger: 'blur'
          }
        ],
        name: [{required: true, message: "请输入姓名", trigger: "blur"}],
        phone: [{
          required: true,
          validator: validatePhone,
          trigger: ["blur", "change"],
        }]
      },//校验规则

    }
  },

  mounted() {
    this.fetchUsers()
  },
  methods: {

    //打开添加窗口处理
    handleAdd() {

      this.user = { //将数据清空,
        _id: null,
        username: "",
        password: "",
        name: "",
        phone: "",
        role_id: "",

      }
      this.userFormVisible = true;
      this.$nextTick(() => {
        this.$refs['userForm'].resetFields();
      });
    },
    //添加用户
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          userApi.add(this.user).then(res => {
            const resp = res.data
            if (resp.status === 0) {
              this.userFormVisible = false
              this.fetchUsers()
            }
          })
        } else {
          return false
        }
      })
    },

    //更新用户
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          userApi.update(this.user).then(res => {
            const resp = res.data
            if (resp.status === 0) {
              this.userFormVisible = false
              this.fetchUsers()
            }
          })
        } else {
          return false
        }
      })
    },

    //编辑功能
    handleEdit(_id) {
      this.handleAdd() //点击编辑功能时,将用户清空,并打开窗口
      userApi.getById(_id).then(response => { //发送请求,将组件中的user赋值,方便编辑窗口读取到具体的值
        const resp = response.data
        if (resp.status === 0) {
          this.user = resp.data
        }
      })
    },
    handleDelete(_id) {
      this.$confirm("确认删除这条记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //确认
        userApi.deleteById(_id).then((response) => {
          const resp = response.data;
          if (resp.status === 0) {
            //提示信息
            this.$message({
              type: "success",
              message: "删除用用户成功"
            })
            //更新总页数
            this.totalPage = (this.total - 1) / this.pageSize;
            //删除成功,刷新列表
            this.fetchUsers();
          }
        })
      }).catch(() => {
        //取消删除,不理会
      })
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchUsers();

    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchUsers();
    },
    fetchUsers() {
      if(this.currentPage > Math.ceil(this.totalPage)){
        this.currentPage = Math.ceil(this.totalPage)
      }

      userApi.getUserList(this.currentPage, this.pageSize).then(res => {
        // console.log("res",res)
        const resp = res.data
        if (resp.status === 0) {
          this.users = resp.data.data //用户数据
          this.roleOptions = resp.data.roles; //所有角色列表
          this.total = resp.data.total //总条数
          this.totalPage = this.total / this.pageSize; //总页数
          // console.log("roleOptions", this.roleOptions)
        }
      }).catch(err => {

      })
    },

    resetDate(row, column, cellValue, index) {//格式化日期数据
      return formatDateNoTime(cellValue - 0)
    },
    formatRole(row, column, cellValue, index){
      // this.roleOptions.find(item=>item._id===cellValue)
      return this.roleOptions.filter((item,index,arr)=>item._id===cellValue)[0].name; //filter返回一个数组
    }

  }
}
</script>

<style scoped>

</style>