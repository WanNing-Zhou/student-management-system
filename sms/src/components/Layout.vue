<template>
  <div>
    <div class="header">header</div>
    <div class="navbar">navbar</div>
    <div class="main"></div>
  </div>
</template>

<script>
//layout是具体的布局
export default {
  name: "Layout"
}
</script>

<style scoped>
.header{
  position: absolute;
  line-height: 50px;
  padding: 0px;
  top: 0;
  left: 0;
  right: 0;
  background-color: #2d3a4b;
}

.navbar{
  position: absolute;
  width: 230px;
  top: 50px;
  left: 0;
  bottom: 0;
  overflow-y:auto;
  background-color: #545c64;
}
.main{
  position: absolute;
  top:50px;
  left: 230px;
  right: 0;
  bottom: 0;
  padding: 10px;
  overflow-y: auto;
  background-color: yellowgreen;
}


</style>