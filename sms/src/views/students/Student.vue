<template>
  <div>

    <el-form ref="searchForm" :inline="true" :model="search" style="margin-top:20px">
      <el-form-item prop="name">
        <el-input v-model="search.name" placeholder="根据姓名查询" style="width:150px"></el-input>
      </el-form-item>
      <el-form-item prop="direction">
        <el-select v-model="search.direction" class="filter-item" placeholder="根据学习方向查询" style="width:150px">
          <el-option v-for="option in directionOptions" :key="option.type" :label="option.name"
                     :value="option.type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="class">
        <el-select v-model="search.class" class="filter-item" placeholder="根据班级查询" style="width:150px">
          <el-option v-for="option in classOptions" :key="option._id" :label="option.name"
                     :value="option.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop=" teacher">
        <el-input v-model="search.teacher" placeholder="根据教师查询" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item prop="manager">
        <el-input v-model="search.manager" placeholder="根据学管查询" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchData" icon="el-icon-search">查询</el-button>
        <el-button type="primary" @click="handleAdd" icon="el-icon-edit">新增</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>



    <el-table :data="students" border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="student-table-expand">
            <el-form-item label="学员姓名">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="性别">
              <span>{{ props.row.gender | dataFilter(genderOptions) }}</span>
            </el-form-item>
            <el-form-item label="所在学校">
              <span>{{ props.row.school }}</span>
            </el-form-item>
            <el-form-item label="专业">
              <span>{{ props.row.major }}</span>
            </el-form-item>
            <el-form-item label="年级">
              <span>{{ props.row.grade | dataFilter(gradeOptions) }}</span>
            </el-form-item>
            <el-form-item label="学历">
              <span>{{ props.row.education | dataFilter(educationOptions) }}</span>
            </el-form-item>
            <el-form-item label="学习方向">
              <span>{{ props.row.direction | dataFilter(directionOptions) }}</span>
            </el-form-item>
            <el-form-item label="身份证号码">
              <span>{{ props.row.id_number }}</span>
            </el-form-item>
            <el-form-item label="联系电话">
              <span>{{ props.row.phone }}</span>
            </el-form-item>
            <el-form-item label="家长姓名">
              <span>{{ props.row.parent }}</span>
            </el-form-item>
            <el-form-item label="家庭住址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="QQ号码">
              <span>{{ props.row.qq }}</span>
            </el-form-item>
            <el-form-item label="所在班级">
              <span>{{ props.row.class }}</span>
            </el-form-item>
            <el-form-item label="入学时间">
              <span>{{ props.row.admission_date }}</span>
            </el-form-item>
            <el-form-item label="授课教师">
              <span>{{ props.row.teacher_id | teacherOrManagerFilter(teacherOptions) }}</span>
            </el-form-item>
            <el-form-item label="学管">
              <span>{{ props.row.manager_id | teacherOrManagerFilter(managerOptions) }}</span>
            </el-form-item>
            <el-form-item label="照片">
              <el-image v-for="item in props.row.pictures" :key="item.index"
                        style="width:200px; height:200px; margin-right:10px; padding:5px; border:1px solid #ccc"
                        :src="baseUrl + '/upload/' + item" :preview-src-list="setSrcList(props.row.pictures)">
              </el-image>
            </el-form-item>
            <el-form-item label="备注">
              <span v-html="props.row.note"></span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column label="学员姓名" prop="name"></el-table-column>
      <el-table-column label="性别" prop="gender">
        <template slot-scope="scope">
          <span>{{ scope.row.gender | dataFilter(genderOptions) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所学方向" prop="direction">
        <template slot-scope="scope">
          <span>{{ scope.row.direction | dataFilter(directionOptions) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" prop="phone"></el-table-column>
      <el-table-column label="所在班级" prop="class"></el-table-column>
      <el-table-column label="授课教师" prop="teacher_id">
        <template slot-scope="scope">
          <span>{{ scope.row.teacher_id | teacherOrManagerFilter(teacherOptions) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学管" prop="manager_id">
        <template slot-scope="scope">
          <span>{{ scope.row.manager_id | teacherOrManagerFilter(managerOptions) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150x">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row._id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>



    <el-pagination layout="total ,sizes, prev, pager, next, jumper" :total="total" :page-size="pageSize"
                   :page-sizes="[5, 10, 20]" :current-page="currentPage" @current-change="handleCurrentChange"
                   @size-change="handleSizeChange">
    </el-pagination>

  </div>
</template>

<script>
import studentApi from '@/api/student.js'
import roleApi from "@/api/role";
import schoolApi from '@/api/school.js'
import classsApi from '@/api/classs.js'
import userApi from '@/api/user.js'
import majorApi from '@/api/major.js'

export default {
  filters: {
    dataFilter(type, dataOptions) {
      const obj = dataOptions.find(obj => obj.type === type)
      return obj ? obj.name : null
    },
    teacherOrManagerFilter(_id, options) {
      // console.log("_id",_id)
      // console.log("options",options)
      const obj = options.find(obj => obj._id === _id)
      return obj ? obj.name : null
    },
    admissionDate(date) {
      return new Date(date).format("yyyy-MM-dd")
    }
  },
  data() {
    return {
      baseApi: process.env.VUE_APP_BASE_API,
      baseUrl: process.env.VUE_APP_SERVICE_URL,
      total: 0,
      totalPage: 1,
      currentPage: 1,
      pageSize: 5,
      students: [],
      genderOptions: [
        { type: "0", name: '男' },
        { type: "1", name: '女' },
      ],
      schoolOptions: [],
      majorOptions: [],
      gradeOptions: [
        { type: '1', name: '大一' },
        { type: '2', name: '大二' },
        { type: '3', name: '大三' },
        { type: '4', name: '大四' },
        { type: '5', name: '在读研究生' }
      ],
      educationOptions: [
        { type: '1', name: '专科' },
        { type: '2', name: '本科' },
        { type: '3', name: '硕士' },
        { type: '4', name: '社会' }
      ],
      directionOptions: [
        { type: '1', name: 'web前端' },
        { type: '2', name: 'Java' },
        { type: '3', name: 'C/C++' },
        { type: '4', name: 'UI/UE' },
      ],
      classOptions: [],
      teacherOptions: [],
      managerOptions: [],
      search: {
        name: '',
        direction: '',
        class: '',
        teacher: '',
        manager: ''
      },
      searchMap: {
        name: '',
        direction: '',
        class: '',
        teacher: '',
        manager: ''
      },
      teacherId:'',
      managerId:'',
      updateStudent:'',
    };
  },

  components: {},
  mounted() {
    this.fetchStudents();
    this.getAllRole();
    this.getUserList();
    this.getClassList();
    this.getSchoolList();
    this.getMajorList();

  },

  methods: {
    formatData(row, column, cellValue, index, options) {
      const obj = options.find(obj => obj.type === cellValue);
      return obj ? obj.name : null;
    },
    handleEdit(_id) {
      this.$router.push(`/student/update/${_id}`)
    },
    handleDelete(_id) {
      this.$confirm('确认删除这条记录吗？', "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        studentApi.deleteById(_id).then(response => {
          const res = response.data
          console.log(res);
          this.$message({
            type: res.status === 0 ? "success" : "error",
            message: res.msg
          })
          if (res.status === 0) {
            //更新总页数
            this.totalPage = (this.total - 1) / this.pageSize;
            this.fetchStudents()
          }
        })
      }).catch(() => {

      })
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchStudents();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchStudents();
    },
    fetchStudents() {
      if(this.currentPage > Math.ceil(this.totalPage)){
        // console.log(this.totalPage)
        this.currentPage = Math.ceil(this.totalPage)
      }
      studentApi.getStudentList(this.currentPage, this.pageSize, this.searchMap).then(response => {
        const res = response.data
        if (res.status === 0) {
          this.students = res.data.data;
          this.total = res.data.total;
          this.totalPage = this.total / this.pageSize
        }
      })
    },

    getAllRole(){
      roleApi.getRoleList().then(response=>{
        const resp = response.data
        resp.data.forEach(item=>{
          if(item.name==="教师")
            this.teacherId = item._id
          if (item.name==="学管")
            this.managerId = item._id
          console.log(this.teacherId,"$$",this.managerId)
        })

      })
    },

    getUserList() {
      userApi.getUserAll().then(response => {
        const res = response.data
        if (res.status === 0) {
          this.userAll = res.data;
          this.userAll.forEach(item => {
            // console.log("role_id",item.role_id)
            // console.log('teacherId',this.teacherId)
            if (item.role_id === this.teacherId) {
              this.teacherOptions.push(item)
            } else if (item.role_id === this.managerId) {
              this.managerOptions.push(item)
            }
          })
        }
      })
    },

    getClassList() {
      classsApi.getClassAll().then(response => {
        const res = response.data;
        if (res.status === 0) {
          this.classOptions = res.data
        }
      })
    },
    getSchoolList() {
      schoolApi.getSchoolAll().then(response => {
        const res = response.data;
        if (res.status === 0) {
          this.schoolOptions = res.data
          const arr = res.data
          for (let i = 0; i < arr.length; i++) {
            this.schoolOptions[i].value = arr[i].schoolname;
            this.schoolOptions[i]._id = arr[i]._id;
          }
        }
      })
    },
    getMajorList() {
      majorApi.getMajorAll().then(response => {
        const res = response.data;
        if (res.status === 0) {
          this.majorOptions = res.data
          const arr = res.data
          for (let i = 0; i < arr.length; i++) {
            this.majorOptions[i].value = arr[i].name;
            this.majorOptions[i]._id = arr[i]._id;
          }
        }
      })
    },
    setSrcList(imgList) {
      console.log("imgList", imgList);
      return imgList.map(item => this.baseUrl + "/upload/" + item)
    },

    searchData() {
      this.currentPage = 1;
      const resTeacher = this.userAll.find(item => item.name === this.search.teacher) || {};
      const resManager = this.userAll.find(item => item.name === this.search.manager) || {};

      if (resTeacher._id) {
        this.searchMap.teacher_id = resTeacher._id
      } else if (this.search.teacher) {
        this.searchMap.teacher_id = "-1"
      } else {
        this.searchMap.teacher_id = ""
      }

      if (resManager._id) {
        this.searchMap.manager_id = resManager._id
      } else if (this.search.manager) {
        this.searchMap.manager_id = "-1"
      } else {
        this.searchMap.manager_id = ""
      }
      this.searchMap.direction = this.search.direction || "";
      this.searchMap.name = this.search.name || "";
      this.searchMap.class = this.search.class || "";
      this.fetchStudents();
    },

    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateStudent.pictures = this.getImgs();
          studentApi.add(this.updateStudent).then(response => {
            const res = response.data
            console.log(res);
            if (res.status === 0) {
              this.$router.replace("/student");
            }
          })
        } else {
          return false
        }
      })
    },
    handleAdd() {
      this.$router.push(`/student/update/-1`)
    },
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateStudent.pictures = this.getImgs();
          studentApi.update(this.updateStudent).then(response => {
            const res = response.data
            console.log(res);
            if (res.status === 0) {
              this.$router.replace("/student")
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.searchData();
    },
    querySearchSchool(queryString, cb) {
      let schoolOptions = this.schoolOptions;
      let results = queryString ? schoolOptions.filter(this.createFilter(queryString)) : schoolOptions;
      cb(results)
    },
    querySearchMajor(queryString, cb) {
      let majorOptions = this.majorOptions;
      let results = queryString ? majorOptions.filter(this.createFilter(queryString)) : majorOptions;
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return restaurant.value.indexOf(queryString) === 0
      }
    },
    getImgs() {
      return this.fileList.map(file => file.name)
    },
  }
}
</script>

<style>
.student-tabel-expand {
  font-size: 0;
}

.student-table-expand label {
  width: 90px;
  color: #99a9bf
}

.student-table-expand .el-form-item {
  margin-left: 20px;
  margin-right: 0;
  margin-bottom: 0;
  width: 45%;
}

.update-dialog .el-dialog {
  margin-top: 50px;
  height: 700px;
  overflow-y: auto;
}

.update-from .el-select {
  width: 400px;
}

.update-from .el-form-item__content .el-input {
  width: 400px;
}

.v-model {
  display: none;
}
</style>