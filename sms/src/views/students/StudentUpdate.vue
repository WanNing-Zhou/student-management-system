<template>
  <div class="student-update">
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
                         :fetch-suggestions="querySearchSchool">
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="专业" prop="major">
        <el-autocomplete v-model="updateStudent.major" class="inline-input"
                         :fetch-suggestions="querySearchMajor">
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
                 @click="updateStudent._id === null ? addData('studentForm') : updateData('studentForm')">确
        定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "StudentUpdate"
}
</script>

<style scoped>

</style>