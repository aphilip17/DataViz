<template>
	<div class="my-map card-panel hoverable">
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
					@click="(evt) => {
							onSelectCircle(evt, circle);
					}">
					<l-popup
						:content="getContentTooltip(circle, layer)">
					</l-popup>
				</l-circle>
			</l-feature-group>
		</l-map>
	</div>
</template>

<script>
/* Libs */
import { latLng } from 'leaflet';
import { LMap, LTileLayer, LFeatureGroup, LCircle, LPopup, LControlLayers } from 'vue2-leaflet';

/* Utils */
import { useFetchGeojson, useFetchDataCovid, useGetPolygonCentroid } from '../composition/fetcher';

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
		LPopup,
		LControlLayers,
	},

	data() {
		return {
			zoom: 6,
			center: latLng(46.9052455464292, 2.8125),
			url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
			subdomains: 'abcd',
			maxZoom: 19,
			selectedFeature: {},
			selectedCircleProp: {
				code: 75,
				nom: 'Paris'
			},
			layers: [{
				name: 'Deaths',
				id: 'dc',
				color: '#ff033e',
				state: true
			}, {
				name: 'Hospitalized',
				id: 'hosp',
				color: '#ffff00',
				state: false
			}, {
				name: 'Critical care',
				id: 'rea',
				color: '#1de9b6',
				state: false
			}, {
				name: 'Healed',
				id: 'rad',
				color: '#00e5ff',
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
				this.$root.$emit('clear-selection');

			}.bind(this));
		});

		this.$root.$on('active-data', function (id, state) {
			let layer = this.layers.find((layer) => {
					if (layer.id === id) {
							return layer;
					}
			});
			layer.state = state;
		}.bind(this));
	},

	methods: {
		async displayCircles() {
			await this.fetchDeptGeometries();
			await this.fetchDataCovid();
			this.getCentroid();
		},

		getRadius(dep, layer) {
			const data = this.dataCodiv[dep][0][layer.id];

			return Math.sqrt(data) * 1000;
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

		onSelectCircle(evt, circle) {
			/* Reset original opacity. */
			if (this.selectedFeature.setStyle) {
					this.selectedFeature.setStyle({ fillOpacity: 0.2 });
			}

			this.selectedFeature = evt.target;
			this.selectedFeature.setStyle({ fillOpacity: 1 });
			this.selectedCircleProp = circle.properties;

			/* For charts */
			const dataDep = this.dataCodiv[this.selectedCircleProp.code][0];
			this.$root.$emit('select-dept', this.selectedCircleProp, dataDep);
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
	width: 50%;
	box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
}
</style>
