<template>
  <div>
    <el-form :model="updateRole" ref="roleForm" label-width="100px" label-position="right" style="width:400px" :rules="rules">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="updateRole.name" placeholder="请输入角色名称" ></el-input>
      </el-form-item>
    </el-form>
    <el-tree
        :data="authList"
        show-checkbox
        node-key="index"
        :default-expand-all="true"
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="[5]"
    >
    </el-tree>
  </div>
</template>

<script>
import menuList from "@/config/menuConfig";
export default {
  name: "Auth",
  data(){
    return{
      updateRole:{
        name:''
      },
      rules:{
        name:[{required:true,message:'请输入角色名称',trigger:'blur'}],
        menus:[]
      },
      authList:[], //存储树形控件数据

    }
  },
  props:['role'],//从父组件那里接收一个角色对象
  mounted(){
    this.updateRole={...this.role}
    this.authList = this.getAuthNodes(menuList)
  },
  methods:{
    //生成树形控件数据的树形数组
    getAuthNodes(menuList){
      return menuList.map(item=>{
        if(!item.children){
          return {
            index:item.index,
            label:item.title
          }
        }else {
          return {
            index: item.index,
            label: item.title,
            children:this.getAuthNodes(item.children)
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>