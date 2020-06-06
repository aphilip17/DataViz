<script>
import MyMap from '@/components/MyMap.vue'
import DataBar from '@/components/DataBar.vue'
import LineChart from '@/components/LineChartWrapper.vue'

export default {
  name: 'Dashboard',
  components: {
    MyMap,
    DataBar,
    LineChart,
  },
}
</script>

<template>
  <div>
    <data-bar></data-bar>
    <div class="map-chart-container">
      <my-map></my-map>
      <line-chart></line-chart>
    </div>
  </div>
</template>

<style scoped>
  .map-chart-container {
    display: flex;
    margin: 20px;
  }
</style>
