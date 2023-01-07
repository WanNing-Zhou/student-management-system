<template>
<!--角色管理的里面会有一个bug-->
  <div>
    <div class="btn_box" style="margin:20px 0">
        <el-button type="primary" @click="handleAdd">创建角色</el-button>
        <el-button type="primary" @click="" :disabled="!currentRow ? true : false" @click="roleAuthVisible=true" >设置角色权限</el-button>
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
          property="create_time"
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

<!-- 添加角色弹窗   -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="role" ref="roleForm" label-width="100px" label-position="right" style="width:400px" :rules="roleRules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="role.name" placeholder="请输入角色名称" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData('roleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 设置角色权限痰喘   -->
    <el-dialog title="设置角色权限" :visible.sync="roleAuthVisible" width="500px">
     <Auth :role="currentRow" ref="auth"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleAuthVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRole">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import roleApi from '@/api/role'
import Auth from "@/views/role/Auth";
import memoryUtils from "@/utils/memoryUtils";
export default {

  components:{
    Auth
  },
  mounted() {
    this.fetchData()
  },
  name: "index",
  data(){
    return{
      currentRow: null,//选中的行
      roleList:[],
      dialogFormVisible: false,
      roleAuthVisible:false,
      role:{
        name:'',
        menus:[]
      },
      roleRules:{
        name:[{required:true,message:'请输入角色名称',trigger:'blur'}],
        menus:[]
      },
      rules:{

      }
    }
  },
  methods:{
    handleAdd(){
      this.dialogFormVisible=true
      this.$nextTick(()=>{ //使用这个方法,会在里面组件所有元素加载完后执行回调中的内容
        this.$refs['roleForm'].resetFields()//弹窗没有加载出来重置的话,会报错 解决办法
      })

    },
    handleCurrentChange(val){ //更新选中的行
      this.currentRow = val
    },
    fetchData(){
      roleApi.getRoleList().then(res=>{
        const resp = res.data
        if(resp.status===0){
          this.roleList = resp.data
        }
      })
    },
    addData(formName){
      this.$refs[formName].validate(valid=>{
        if (valid){
             roleApi.add(this.role.name).then(res=>{
               const resp = res.data
               if(resp.status ===0){
                 this.$message({
                   type:'success',
                   message:'添加角色成功',
                 })
                 this.dialogFormVisible = false   //添加成功后关闭弹窗
                 this.fetchData()  //重新获取数据
               }
             })
        }else {
          return false
        }
      })
    },

    updateRole(){ //更新角色 /为角色设置权限
      console.log(this.$refs['auth'].getMenus())
      const newRole = this.$refs['auth'].getMenus()
      this.currentRow.menus = newRole.menus
      this.currentRow.name = newRole.name
      this.currentRow.auth_name=memoryUtils.user.username
      roleApi.updateRole(this.currentRow).then(res=>{
        const resp = res.data;
        if(resp.status === 0){
          this.$message({
            type:'success',
            message:'设置成功'
          })
          this.roleAuthVisible = false
          this.fetchData()
        }
      })
    }
  }
}
</script>

<style scoped>

</style>