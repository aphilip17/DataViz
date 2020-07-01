<template>
  <div>
    <data-bar></data-bar>
    <my-map></my-map>
  </div>
</template>

<script>
/* Views */
import MyMap from '@/components/MyMap.vue';
import DataBar from '@/components/DataBar.vue';

export default {
  name: 'Dashboard',
  components: {
    MyMap,
    DataBar,
  },
}
</script>

<style scoped>

</style>
