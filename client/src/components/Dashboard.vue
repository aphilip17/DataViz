<template>
  <div>
    <header-bar></header-bar>
    <div class="container">
      <data-bar></data-bar>
      <div class="row">
        <div class="col s12 m6 l6">
          <my-map></my-map>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* Views */
import MyMap from '@/components/MyMap.vue';
import DataBar from '@/components/DataBar.vue';
import HeaderBar from '@/components/Header.vue';

export default {
  name: 'Dashboard',
  components: {
    MyMap,
    DataBar,
    HeaderBar
  },
}
</script>

<style scoped>
</style>
