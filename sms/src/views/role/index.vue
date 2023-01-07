<template>

  <div>
    <div class="btn_box" style="margin:20px 0">
        <el-button type="primary" @click="handleAdd">创建角色</el-button>
        <el-button type="primary" disabled>设置角色权限</el-button>
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
          property="creat_time"
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

    <el-dialog title="收货地址" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="role" ref="roleForm" label-width="100px" label-position="right" style="width:400px" :rules="rules">
        <el-form-item label="角色名称" >
          <el-input v-model="role.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData('roleForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import roleApi from '@/api/role'
export default {

  mounted() {
    this.fetchData()
    console.log(this.roleList)
  },
  name: "index",
  data(){
    return{
      currentRow: null,//选中的行
      roleList:[],
      dialogFormVisible: false,
      role:{
        name:'',
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
        this.$refs['roleForm'].resetFie lds()//弹窗没有加载出来重置的话,会报错 解决办法
      })

    },
    handleCurrentChange(val){
      this.currentRow = val
    },
    fetchData(){
      roleApi.getRoleList().then(res=>{
        const resp = res.data
        console.log(resp)
        if(resp.status==0){
          this.roleList = resp.data
        }
      })
    },
    addData(formName){
      this.$refs[formName].validate(valid=>{
        if (valid){

        }else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>