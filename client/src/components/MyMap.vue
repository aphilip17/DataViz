<template>
	<div class="my-map hoverable">
    <l-map
			ref="myMap"
			:zoom="zoom"
			:center="center">
			<l-tile-layer
				:url="url"
				:attribution="attribution"
				:subdomains="subdomains"
				:maxZoom="maxZoom">
			</l-tile-layer>
			<l-control-layers
				position="topright"
				ref="layersControl">
			</l-control-layers>
			<l-feature-group
				v-for="(layer, index) in layers"
				:visible="layer.state"
				:ref="layer.id"
				:key="index">
				<l-circle
					v-for="(circle, index) in circles"
					:key="index"
					:name="circle.properties.code + layer.id"
					:lat-lng="[circle.geometry.coordinates[1], circle.geometry.coordinates[0]]"
					:radius="getRadius(circle.properties.code, layer)"
					:weight="2"
					:color="layer.color"
					:fillColor="layer.color"
					:fillOpacity="0.2"
					@mouseover="(evt) => {
							onMouseOverCircle(evt);
					}"
          @mouseout="onMouseOutCircle()"
          @click="onClickCircle(circle)">
					<l-tooltip
						:content="getContentTooltip(circle, layer)">
					</l-tooltip>
				</l-circle>
			</l-feature-group>
		</l-map>
	</div>
</template>

<script>
/* Libs */
import { latLng } from 'leaflet';
import { LMap, LTileLayer, LFeatureGroup, LCircle, LTooltip, LControlLayers } from 'vue2-leaflet';

/* Utils */
import { useFetchGeojson, useFetchDataCovid, useGetPolygonCentroid } from '../composition/fetcher';
import store from '../Store.js';

export default {
	setup () {
		const {
				data: depts,
				fetchData: fetchDeptGeometries,
		} = useFetchGeojson();

		const {
				data: dataCodiv,
				fetchData: fetchDataCovid,
		} = useFetchDataCovid();

		const {
				centroid: circles,
				getCentroid: getCentroid
		} = useGetPolygonCentroid(depts);

		return {
				depts,
				fetchDeptGeometries,
				dataCodiv,
				fetchDataCovid,
				circles,
				getCentroid,
		}
  },

	name: 'my-map',

	components: {
		LMap,
		LTileLayer,
		LFeatureGroup,
		LCircle,
		LTooltip,
		LControlLayers,
  },

  store: store,

	data() {
		return {
			zoom: 6,
			center: latLng(46.9052455464292, 2.8125),
			url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
			subdomains: 'abcd',
			maxZoom: 19,
			selectedFeature: {},
			layers: [{
				name: 'Deaths',
				id: 'dc',
				color: '#f80759',
				state: true
			}, {
				name: 'Hospitalized',
				id: 'hosp',
				color: '#ffa751',
				state: false
			}, {
				name: 'Critical care',
				id: 'rea',
				color: '#3cd3ad',
				state: false
			}, {
				name: 'Healed',
				id: 'rad',
				color: '#1fa2ff',
				state: false
			} ]
		}
	},

	created() {
    this.displayCircles();
	},

	mounted() {
		this.$nextTick(() => {
			this.addLayerToControlLayers();

			this.$refs.myMap.mapObject.on('baselayerchange', function() {
				this.selectedFeature = {};
			}.bind(this));
		});
	},

	methods: {
		async displayCircles() {
      if (this.$store.getters.getDeptsGeojson.features) {
        this.depts = this.$store.getters.getDeptsGeojson;
      } else {
        await this.fetchDeptGeometries();
        this.$store.commit('SET_DEPTS_GEOJSON', this.depts);
      }

      if (this.$store.getters.getDataCovid['01']) {
        this.dataCodiv = this.$store.getters.getDataCovid;
      } else {
        await this.fetchDataCovid();
        this.$store.commit('SET_DATA_CODIV', this.dataCodiv);
      }

      if (this.$store.getters.getCircles.length) {
        this.circles = this.$store.getters.getCircles;
      } else {
        this.getCentroid();
        this.$store.commit('SET_CIRCLES', this.circles);
      }
		},

		getRadius(dep, layer) {
      /* TODO: I should find the mutiplicator regarding the min and max value */
      let multiplicator = layer.id === 'rea' ? 5000 : 1000;
			const data = this.dataCodiv[dep][0][layer.id];

			return Math.sqrt(data) * multiplicator;

		},

		getContentTooltip(circle, layer) {
			const dep = circle.properties.code;
			const color = layer.color;
			const data = this.dataCodiv[dep][0][layer.id];

			return `<span style='color: ${color}; font-weight: bold'> ${circle.properties.nom} ${dep} </span>
							<div>
									<span> ${layer.name}: </span>
									<span> ${data} </span>
							</div>`
		},

		onMouseOverCircle(evt) {
      this.selectedFeature = evt.target;
      this.style = Object.assign({}, this.selectedFeature.options);
      this.selectedFeature.setStyle({
        fillOpacity: 0.2,
        fillColor: 'blue',
        color: 'blue',
        opacity: 1,
        weight: 2
      });
    },

    onMouseOutCircle() {
      this.selectedFeature.setStyle(this.style);
    },

    onClickCircle(circle) {
      this.$root.$router.push({ path: `/dashboard/${circle.properties.nom}`});
      this.$store.commit('SET_DEPT', circle.properties);
    },

		addLayerToControlLayers() {
			/* Add layers to controlLayers by hand. For some reasons only one layer is added
			using the declarative rendering in the template. */
			const layersControl = this.$refs.layersControl.mapObject;

			layersControl.addBaseLayer(this.$refs.dc[0].mapObject, 'Deaths');
			layersControl.addBaseLayer(this.$refs.rad[0].mapObject, 'Healed');
			layersControl.addBaseLayer(this.$refs.rea[0].mapObject, 'Critical care');
			layersControl.addBaseLayer(this.$refs.hosp[0].mapObject, 'Hospitalized');
		}
	}
}
</script>

<style scoped>
.my-map {
	height: 600px;
}

</style>
