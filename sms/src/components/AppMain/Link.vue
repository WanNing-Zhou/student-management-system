<!--面包屑-->
<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item class="line">{{ $route.meta.title }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  data() {
    return {
    }
  },

  components: {},

  methods: {}
}
</script>


<style scoped>
.el-bradcrumb {
  height: 10px;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 1);

}

.line {
  border-left: 3px solid goldenrod;
  text-indent: 1em;
}
</style>