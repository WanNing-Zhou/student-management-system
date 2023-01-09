<template>
  <div>

    <!--学员数据展示-->
    <el-table :data="students" border style="width: 100%">
    <!--  详细信息(扩展空能)    -->
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
      <el-table-column label="学员姓名" prop="name" width="100"></el-table-column>
      <el-table-column label="性别" prop="gender" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.gender | dataFilter(genderOptions) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学习方向" prop="direction">
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
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row._id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import studentApi from "@/api/student";
export default {
  name: "Students",
  mounted() {
    this.fetchStudents()
  },
  data() {
    return {
      baseApi: process.env.VUE_APP_BASE_API,
      baseUrl: process.env.VUE_APP_SERVICE_URL,
      total: 0,
      totalPage: 1,
      currentPage: 1,
      pageSize: 5,
      students: [],  //存放学生列表
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
      }
    };
  },
  methods:{
    handleEdit(_id){

    },
    handleDelete(_id){

    },
    fetchStudents(){
      studentApi.getStudentList(this.currentPage,this.pageSize,this.searchMap).then(response=>{
        const resp = response.data
        if(resp.status === 0){
          this.students = resp.data.data
          this.total = resp.data.total
          this.totalPage = this.total/this.pageSize
        }
      })
    }

  }
}
</script>

<style >

.student-tabel-expand {
  font-size: 0;
}

.student-table-expand label {
  width: 90px;
  color: #99a9bf
}

.demo-total-expand .el-form-ite__lable{
  width: 90px;
  color:  #99a9bf;
}

.student-table-expand .el-form-item {
  margin-left:20px ;
  margin-right: -20px;
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