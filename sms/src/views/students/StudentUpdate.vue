<template>
  <div class="student-update">
    <!--后退按钮-->
    <el-button icon="el-icon-arrow-left" @click="$router.push('/student')" circle></el-button>

    <el-form status-icon ref="studentForm" :model="updateStudent" label-width="100px" label-position="right"
             style="width:100%; height:100%" :rules="rules" class="update-from">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="updateStudent.name"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="updateStudent.gender" class="filter-item" placeholder="请点击选择" width="600px">
          <el-option v-for="option in genderOptions" :key="option.type" :label="option.name"
                     :value="option.type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所在学校" prop="school">
        <el-autocomplete v-model="updateStudent.school" class="inline-input"
                         :fetch-suggestions="querySearchSchool" value-key="schoolname">
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="专业" prop="major">
        <el-autocomplete v-model="updateStudent.major" class="inline-input"
                         :fetch-suggestions="querySearchMajor" value-key="majorname">
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="年级" prop="grade">
        <el-select v-model="updateStudent.grade" class="filter-item" placeholder="请点击选择" width="600px">
          <el-option v-for="option in gradeOptions" :key="option.type" :label="option.name"
                     :value="option.type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学历" prop="education">
        <el-select v-model="updateStudent.education" class="filter-item" placeholder="请点击选择" width="600px">
          <el-option v-for="option in educationOptions" :key="option.type" :label="option.name"
                     :value="option.type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学习方向" prop="direction">
        <el-select v-model="updateStudent.direction" class="filter-item" placeholder="请点击选择" width="600px">
          <el-option v-for="option in directionOptions" :key="option.type" :label="option.name"
                     :value="option.type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="身份证号" prop="id_number">
        <el-input v-model="updateStudent.id_number"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="updateStudent.phone"></el-input>
      </el-form-item>
      <el-form-item label="家长姓名" prop="parent">
        <el-input v-model="updateStudent.parent"></el-input>
      </el-form-item>
      <el-form-item label="家长联系电话" prop="parent_phone">
        <el-input v-model="updateStudent.parent_phone"></el-input>
      </el-form-item>
      <el-form-item label="家庭住址" prop="address">
        <el-input v-model="updateStudent.address"></el-input>
      </el-form-item>
      <el-form-item label="QQ号码" prop="qq">
        <el-input v-model="updateStudent.qq"></el-input>
      </el-form-item>
      <el-form-item label="所在班级" prop="class">
        <el-select v-model="updateStudent.class" class="filter-item" placeholder="请点击选择" width="600px">
          <el-option v-for="option in classOptions" :key="option._id" :label="option.name"
                     :value="option.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入学时间" prop="admission_date">
        <el-date-picker v-model="updateStudent.admission_date" type="date" placeholder="请点击选择"
                        value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="授课教师" prop="teacher_id">
        <el-select v-model="updateStudent.teacher_id" class="filter-item" placeholder="请点击选择" width="600px">
          <el-option v-for="option in teacherOptions" :key="option._id" :label="option.name"
                     :value="option._id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学管" prop="manager_id">
        <el-select v-model="updateStudent.manager_id" class="filter-item" placeholder="请点击选择" width="600px">
          <el-option v-for="option in managerOptions" :key="option._id" :label="option.name"
                     :value="option._id">
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 照片墙 -->
      <el-form-item label="照片" prop="pictures">
        <el-upload :action="baseApi + '/manage/img/upload'" list-type="picture-card" :auto-upload="true"
                   :file-list="fileList" name="image" accept="image/*" :on-change="handleChange">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}">
            <img :src="file.url" alt="" class="el-upload-list__item-thumbnail">
            <span class="el-upload-list__item-actions">
                            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                <i class="el-icon-zoom-in"></i>
                            </span>
                            <span v-if="!disabled" class="el-update-list__item-delete" @click="handleDownload(file)">
                                <i class="el-icon-download"></i>
                            </span>
                            <span v-if="!disabled" class="el-update-list__item-delete" @click="handleRemove(file)">
                                <i class="el-icon-delete"></i>
                            </span>
                        </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="pictureDialogVisible">
          <img :src="dialogImageUrl" alt="" width="100%">
        </el-dialog>
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <vue-tinymce v-model="updateStudent.note" :setting="setting"></vue-tinymce>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary"
                 @click="updateStudent._id === null ? addData('studentForm') : updateData('studentForm')"
      >确 定</el-button>
    </div>
  </div>
</template>

<script>
import schoolApi from "@/api/school";
import studentApi from "@/api/student";
import classsApi from "@/api/classs";
import majorApi from "@/api/major";
import roleApi from "@/api/role";
import userApi from "@/api/user";
export default {
  name: "StudentUpdate",
  mounted() {
    this.getSchoolList()
    this.getMajorList()
    this.getAllRole()
    this.getClassList()

    this.getUserList()
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      value = value.trim()
      const phoneReg = /^(13[0-9;]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (value === '') {
        callback(new Error('请输入手机号码'))
      } else if (!phoneReg.test(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    };
    const validateIdNumber = (rule, value, callback) => {
      value = value.trim()
      const _IDRe18 = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      const _IDre15 = /^([1-6][1-9]|50)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/;
      if (_IDRe18.test(value) || _IDre15.test(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的身份证号码'))
      }
    };
    return {
      baseApi: process.env.VUE_APP_BASE_API,
      baseUrl: process.env.VUE_APP_SERVICE_URL,
      updateDialogVisible: false,
      updateStudent: { //存储学生信息
        _id: null,
        name: "",
        gender: "",
        school: "",
        major: "",
        grade: "",
        education: "",
        direction: "",
        id_number: "",
        phone: "",
        parent: "",
        parent_phone: "",
        address: "",
        qq: "",
        class: "",
        admission_date: "",
        teacher_id: "",
        manager_id: "",
        pictures: [],
        note: "",
      },
      genderOptions: [
        { type: "0", name: '男' },
        { type: "1", name: '女' },
      ],
      schoolOptions: [], //学校选择
      majorOptions: [], //专业选择
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
      classOptions: [], //班级选择
      teacherOptions: [], //教师选择
      managerOptions: [],//学管选择
      pictureDialogVisible: false, //大图弹窗是否展示
      dialogImageUrl: "", //大图地址
      disabled: false, //查看大图,删除,下载,三个按钮是否展示
      fileList: [
        // {
        //     uid: "-1",
        //     name: 'food.jpeg',
        //     status: 'success',
        //     url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality100'
        //}
      ], //所有已上传的数组
      setting: { //富文本编辑框配置项
        //去除文件栏
        menubar: false,
        //定义工具栏
        toolbar: "undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontselect fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat |",
        toolbar_drawer: "sliding",
        quickbars_selection_toolbar: "removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor",
        plugins: "link image media table lists fullscreen quickbars",
        language: 'zh_CN', //本地化设置
        height: 350
      },
      rules: { //自定义校验规则
        name: [{ required: true, message: '请填写姓名', trigger: "blur" }],
        gender: [{ required: true, message: '请选择性别', trigger: "blur" }],
        direction: [{ required: true, message: '请选择学习方向', trigger: "blur" }],
        id_number: [{ validator: validateIdNumber, trigger: ["blur", "change"] }],
        phone: [{ required: true, validator: validatePhone, trigger: ["blur", "change"] }],
        class: [{ required: true, message: '请选择所在班级', trigger: "blur" }],
        teacher_id: [{ required: true, message: '请选择授课教师', trigger: "blur" }],
        manager_id: [{ required: true, message: '请选择学管', trigger: "blur" }],
      },
      teacherId:'',
      managerId:'',
    }
  },
  methods:{
    //匹配学校
    querySearchSchool(queryString, cb) {
      let  schoolOptions = this.schoolOptions
      let results = queryString ? schoolOptions.filter(this.createFilter(queryString)):schoolOptions
      //调用 callback返回建议列表的数据
      cb(results);
    },
    //匹配专业
    querySearchMajor(queryString, cb) {
      let  majorOptions = this.majorOptions
      let results = queryString ? majorOptions.filter(this.createFilter(queryString)):majorOptions
      //调用 callback返回建议列表的数据
      cb(results);
    },
    //
    handleChange(file,fileList){
      if(file.status === "success"){
        const result = file.response
        if (result.status === 0){
          const {name,url} = result.data;
          file = fileList[fileList.length - 1] //找到数组中最后一图片,将名子进行更改
          file.name = name
          file.url = url
        }
        this.fileList = fileList
      }
    },

    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateStudent.pictures = this.getImgs();
          studentApi.add(this.updateStudent).then(response => {
            const res = response.data
            if (res.status === 0) {
              this.$router.replace("/student");
            }
          })
        } else {
          return false
        }
      })
    },
    updateData(formMane){ //更新数据
    },

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
          console.log("老师和学管",this.teacherOptions,this.managerOptions)
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
          // for (let i = 0; i < arr.length; i++) {
          //   this.schoolOptions[i].value = arr[i].schoolname;
          //   this.schoolOptions[i]._id = arr[i]._id;
          // }
          // console.log("schoolOptions",this.schoolOptions)
        }
      })
    },

    getMajorList() {
      majorApi.getMajorAll().then(response => {
        const res = response.data;
        if (res.status === 0) {
          this.majorOptions = res.data
          const arr = res.data
          // for (let i = 0; i < arr.length; i++) {
          //   this.majorOptions[i].value = arr[i].majorname;
          //   this.majorOptions[i]._id = arr[i]._id;
          // }
          // console.log("majorOptions",this.majorOptions)
        }
      })
    },
    createFilter(queryString) {
      return (restaurant) => {
        return restaurant.value.indexOf(queryString) === 0
      }
    },

    handleRemove(file) { //删除功能
      studentApi.reqDeleteImg(file.name).then(response => {
        const res = response.data;
        if (res.status === 0) {
          this.fileList.splice(
              this.fileList.indexOf(file), 1); //根据文件的索引删除一张片
        }
      })
    },
    handlePictureCardPreview(file) {  //查看大图的
      this.dialogImageUrl = file.url;
      this.pictureDialogVisible = true
    },
    handleDownload(file) { //下载功能
      console.log(file);
    },

    //获取所有已上传文件的名字
    getImgs() {
      return this.fileList.map(file => file.name)
    },

  }
}
</script>

<style scoped>
.student-update {
  padding: 20px;
}

.el-form {
  margin-top: 20px;
}

.dialog-footer {
  text-align: center;
}

.dialog-footer .el-button {
  width: 400px;
}
</style>