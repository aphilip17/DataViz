<script>
import LineChart from '@/components/Chart.vue'


export default {
  data () {
    return {
        /* initializing the chart-data with null will throw an vue error */
        datacollection: { labels: [''], datasets: []}
    }
  },
  components: {
    LineChart,
  },

  mounted () {
     this.$root.$on('select-dept', function (props, data) {

        const labels = Object.keys(data).filter((elem, idx) => {
            return idx%7===0;
        });

        const datas = Object.values(data).reduce((acc, elem) => {
            if ('dc' in acc) {
                acc['dc'].push(elem.dc)
            } else {
                acc['dc'] = [elem.dc]
            }

            return acc;

        }, {}).dc.filter((el, idx) => {
            return idx%7===0;
        });

        this.datacollection = {
            labels: labels,
            datasets: [
            {
                label: 'Deaths by department',
                backgroundColor: '#f87979',
                borderColor: '#f87989',
                borderWidth: 1,
                fill: false,
                data: datas,
            }]
        }
    }.bind(this));
  },
}
</script>

<template>
    <line-chart
        :chart-data="datacollection"
        class="card-panel hoverable line-chart"
    ></line-chart>
</template>

<style scoped>
    .line-chart {
        margin-left: 20px;
        width: 100%;
        box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
    }
</style>