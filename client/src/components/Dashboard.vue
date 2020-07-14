<template>

  <div class="container">
    <data-bar></data-bar>
    <div class="row">
      <div class="col s12 m6 l6">
        <my-map></my-map>
      </div>
    </div>
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
