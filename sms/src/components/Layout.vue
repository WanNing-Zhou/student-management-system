<template>
  <div>
    <app-header></app-header>
    <app-navbar></app-navbar>
    <app-main></app-main>

  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader'
import AppMain from '@/components/AppNavbar'
import AppNavbar from '@/components/AppMain'


//layout是具体的布局
export default {
  name: "Layout",
  components: {
    AppHeader,
    AppNavbar,
    AppMain,
  },
}
</script>

<style scoped>
.header {
  position: absolute;
  line-height: 50px;
  padding: 0px;
  top: 0;
  left: 0;
  right: 0;
  background-color: #2d3a4b;
}

.navbar {
  position: absolute;
  width: 230px;
  top: 50px;
  left: 0;
  bottom: 0;
  overflow-y: auto;
  background-color: #545c64;
}

.main {
  position: absolute;
  top: 50px;
  left: 230px;
  right: 0;
  bottom: 0;
  padding: 10px;
  overflow-y: auto;
  /*background-color: yellowgreen;*/
}


</style>