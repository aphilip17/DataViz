<script>
import MyMap from '@/components/MyMap.vue'

export default {
  name: 'App',
  components: {
    MyMap
  }
}
</script>

<template>
  <div id="app">
    <my-map></my-map>
  </div>
</template>

<style scoped>
  #app {
    height: 100vh;
  }
</style>
