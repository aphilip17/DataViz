<script>
import MyMap from '@/components/MyMap.vue'
import DataBar from '@/components/DataBar.vue'

export default {
  name: 'App',
  components: {
    MyMap,
    DataBar,
  }
}
</script>

<template>
  <div id="app">
    <data-bar></data-bar>
    <my-map></my-map>
  </div>
</template>

<style scoped>
</style>
