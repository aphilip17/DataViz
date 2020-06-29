<template>
  <div>
    <data-bar></data-bar>
    <div class="map-chart-container">
      <my-map></my-map>
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
.map-chart-container {
	display: flex;
	margin: 20px;
}
</style>
