<script>
	/* Libs */
	import { Line, mixins} from 'vue-chartjs';

	const { reactiveProp } = mixins;

	export default {
		extends: Line,
		mixins: [reactiveProp],
		props: ['chartData', 'clearSelection'],
		data () {
			return {
				options: {
					responsive: true,
					maintainAspectRatio: false,
				}
			}
		},

		mounted () {
			this.renderChart(this.chartdata, this.options);
			/* Ugly I did not find how to wait for the end of rendering.*/
			setTimeout(() => {
				if (!this.chartData.datasets.length) {
					this.clearChart();
				}
			}, 1000);
		},

		watch: {
			clearSelection: function () {
				this.clearChart();
			}
		},

		methods: {
			clearChart() {
				const ctx = this.$data._chart.ctx;
				const width = this.$data._chart.width;
				const height = this.$data._chart.height

				this.$data._chart.clear();

				ctx.save();
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.font = "30px Arial";
				ctx.fillStyle = "#1245A8";
				ctx.fillText('Select a department on the map to display data', width / 2, height / 2);
				ctx.restore();
			}
		}
	}
</script>