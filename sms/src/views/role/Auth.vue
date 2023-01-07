<template>
  <div>
    <el-form :model="updateRole" ref="roleForm" label-width="100px" label-position="right" style="width:400px" :rules="rules">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="updateRole.name" placeholder="请输入角色名称" ></el-input>
      </el-form-item>
    </el-form>
    <el-tree
        ref="tree"
        :data="authList"
        show-checkbox
        node-key="index"
        :default-expand-all="true"
        :default-checked-keys="checkedKeys"
        @check-change="handleCheckChange"
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
      checkedKeys:[], //树形控件选中项的数组  => 树形控件都选中了哪些

    }
  },
  props:['role'],//从父组件那里接收一个角色对象

  mounted(){
    this.updateRole={...this.role} //为updateRole赋初始值
    this.authList = this.getAuthNodes(menuList)
    this.checkedKeys = this.role.menus  //初识权限列表
    // console.log('checkedKeys',this.checkedKeys)
  },

  methods:{

    //为负组件提供最新角色数据
    getMenus(){
      this.updateRole.menus = this.checkedKeys;
      return this.updateRole
    },

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
    },
    //树形控件节点点击回调
    //data:当前点击节点数据,checked:当前节点是否选中,indeterminate:当前节点中的子节点是否有选中状态
    handleCheckChange(data, checked, indeterminate) {
      // console.log("checked",checked);
      // console.log("data",data)
      //如果选中则添加到menu数组中,如果取消勾选则从数组中删除
      if (checked) { //如果是选中
        this.checkedKeys.push(data.index); //将数据保存到checkedKeys中
        let set = new Set(this.checkedKeys); //去重
        this.checkedKeys = Array.from(set);
      } else {
        let deleteIndex = this.checkedKeys.indexOf(data.index);
        if(deleteIndex !== -1){ //当删除的的权限,在权限数组中存在的时候才去删除
          this.checkedKeys.splice(deleteIndex, 1)
        }
      }
      // console.log("checkedKeys",this.checkedKeys)
    }
  },
  watch:{
    role(val){ //当父组件role发生变化的时候需要改变当前显示的数据
      this.updateRole = {...val}
      this.checkedKeys = val.menus
      this.$['tree'].setCheckedKeys(this.checkedKeys)
    }
  }
}
</script>

<style scoped>

</style>