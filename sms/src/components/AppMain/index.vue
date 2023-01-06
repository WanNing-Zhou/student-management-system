<template>
  <div class="main">
    <app-link v-show="$route.path !== '/home'"></app-link>
    <router-view></router-view>
  </div>
</template>

<script>
import AppLink from '@/components/AppMain/Link'

export default {
  components:{
    AppLink
  }

}
</script>

<style scoped>

</style>