<template>
  <line-chart
		:chart-data="datacollection"
		:clear-selection="clearSelection"
		class="card-panel hoverable line-chart">
  </line-chart>
</template>

<script>
/* Views */
import LineChart from '@/components/Chart.vue';

/* Utils */
import { useFetchDataDeptCovid } from '../composition/fetcher';
import store from '../Store.js';

export default {
  setup () {
		const {
				data: covidDept,
				fetchData: fetchDataCovidDept,
    } = useFetchDataDeptCovid();

    return {
				covidDept,
				fetchDataCovidDept,
		}
  },

  data () {
    return {
			/* initializing the chart-data with null will throw an vue error */
			datacollection: { labels: [''], datasets: []},
			clearSelection: 0
    }
  },

  store: store,

  components: {
    LineChart,
  },

  created () {
    this.onSelectDept();
  },

  methods: {
    async onSelectDept () {
      await this.fetchDataCovidDept(this.$store.getters.getSelectedDeptCode);

      const labels = this.covidDept.date.filter((elem, idx) => {
          return idx % 7 === 0;
      });

      this.datacollection = {
				labels: labels,
				datasets: [
				{
					label: 'Deaths',
					backgroundColor: '#f87979',
					borderColor: '#f87989',
					borderWidth: 1,
					fill: false,
					data: this.covidDept.dc.filter((el, idx) => {
							return idx % 7 === 0;
					}),
				}, {
					label: 'Hospitalized',
					backgroundColor: '#ffff00',
					borderColor: '#ffff00',
					borderWidth: 1,
					fill: false,
					data: this.covidDept.hosp.filter((el, idx) => {
							return idx % 7 === 0;
					}),
				}, {
					label: 'Critical care',
					backgroundColor: '#1de9b6',
					borderColor: '#1de9b6',
					borderWidth: 1,
					fill: false,
					data: this.covidDept.rea.filter((el, idx) => {
							return idx % 7 === 0;
					}),
				}, {
					label: 'Healed',
					backgroundColor: '#00e5ff',
					borderColor: '#00e5ff',
					borderWidth: 1,
					fill: false,
					data: this.covidDept.rad.filter((el, idx) => {
							return idx % 7 === 0;
					}),
				}]
      }
    }
  }
}
</script>

<style scoped>
.line-chart {
    margin-left: 20px;
    width: 100%;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
}
</style>