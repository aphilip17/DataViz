<script>
import MyMap from '@/components/MyMap.vue'
import DataBar from '@/components/DataBar.vue'
import LineChart from '@/components/Chart.vue'


export default {
  name: 'App',
  components: {
    MyMap,
    DataBar,
    LineChart,
  }
}
</script>

<template>
  <div id="app">
    <data-bar></data-bar>
    <div class="map-chart-container">
      <my-map></my-map>
      <line-chart
        class="card-panel hoverable line-chart"
      ></line-chart>
    </div>
  </div>
</template>

<style scoped>
  .map-chart-container {
    display: flex;
    margin: 20px;
  }

  .line-chart {
    margin-left: 20px;
    width: 600px;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
  }
</style>
