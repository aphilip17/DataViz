<script>
import { latLng } from 'leaflet';
import { LMap, LTileLayer, LFeatureGroup, LCircle, LPopup, LControlLayers } from 'vue2-leaflet';
import Centroid from '@turf/centroid';

export default {
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
            depts: {},
            circles: [],
            formatDataCodiv: {},
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

    watch: {
        selectedFeature: function() {
            this.selectedFeature.setStyle({ fillOpacity: 1 });
            this.selectedFeature.openPopup();

            /* For charts */
            const dataDep = this.formatDataCodiv[this.selectedCircleProp.code];
            this.$root.$emit('select-dept', this.selectedCircleProp, dataDep);
        }
    },

    mounted() {
        this.$nextTick(() => {
            this.addLayerToControlLayers();
            /* Circles are not yet available in refs even in the $nextTick function. Why ? */
            setTimeout(function() {
                /* When the map is rendering the first time select the circle of Paris by default. */
                this.selectedFeature = this.$refs.parisdc[0].mapObject;

            }.bind(this), 2000);

            this.$refs.myMap.mapObject.on('baselayerchange', function(ly) {
                const layer = this.layers.find((el) => { return el.name === ly.name });
                this.selectedFeature = this.$refs['paris'+layer.id][0].mapObject;

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
        async getDeptsGeojson() {
            try {
                const response = await fetch('http://localhost:8080/depts.json');
                this.depts = await response.json();
                console.log(this.depts);
            } catch (error) {
                console.log(error);
            }
        },

        async getHpCodivData() {
            try {
                const response = await fetch('http://localhost:8080/hpCovid.json');
                const data = await response.json();

                this.formatDataCodiv = data.reduce((accu, elem) => {

                    if (elem.sexe !== 0) {
                        return accu;
                    }

                    if (accu[elem.dep]) {
                        accu[elem.dep].dates.push(elem.jour);
                        accu[elem.dep].hosp.push(elem.hosp);
                        accu[elem.dep].dc.push(elem.dc);
                        accu[elem.dep].rad.push(elem.rad);
                        accu[elem.dep].rea.push(elem.rea);
                    } else {
                        accu[elem.dep] = {
                            dates: [elem.jour],
                            hosp: [elem.hosp],
                            dc: [elem.dc],
                            rad: [elem.rad],
                            rea: [elem.rea]
                        }
                    }

                    return accu;

                }, {})

                console.log(this.formatDataCodiv);

            } catch (error) {
                console.log(error);
            }
        },

        async displayCircles() {
            await this.getDeptsGeojson();
            await this.getHpCodivData();
            this.circles = this.depts.features.map((dpt) => {
                return Centroid(dpt, dpt.properties);
            });

            console.log(this.circles);
        },

        getRadius(dep, layer) {
            const data = this.formatDataCodiv[dep][layer.id];

            return Math.sqrt(data[data.length - 1]) * 1000;
        },

        getContentTooltip(circle, layer) {
            const dep = circle.properties.code;
            const color = layer.color;
            const data = this.formatDataCodiv[dep][layer.id];

            return `<span style='color: ${color}; font-weight: bold'> ${circle.properties.nom} ${dep} </span>
                    <div>
                        <span> ${layer.name}: </span>
                        <span> ${data[data.length - 1]} </span>
                    </div>`
        },

        getParisCircle(circle, layer) {
            if (circle.properties.code === '75') {
                return 'paris' + layer.id;
            }
        },

        onSelectCircle(evt, circle) {
            /* Reset original opacity. */
            this.selectedFeature.setStyle({ fillOpacity: 0.2 });
            this.selectedFeature = evt.target;
            this.selectedCircleProp = circle.properties;
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

<template>
    <div class="my-map card-panel hoverable">
        <l-map
            ref="myMap"
            :zoom="zoom"
            :center="center"
        >
            <l-tile-layer
                :url="url"
                :attribution="attribution"
                :subdomains="subdomains"
                :maxZoom="maxZoom"
            >
            </l-tile-layer>
            <l-control-layers
                position="topright"
                ref="layersControl"
            ></l-control-layers>
            <l-feature-group
                v-for="(layer, index) in layers"
                :visible="layer.state"
                :ref="layer.id"
                :key="index"
            >
                <l-circle
                    v-for="(circle, index) in circles"
                    :key="index"
                    :ref="getParisCircle(circle, layer)"
                    :name="circle.properties.code + layer.id"
                    :lat-lng="[circle.geometry.coordinates[1], circle.geometry.coordinates[0]]"
                    :radius="getRadius(circle.properties.code, layer)"
                    :weight="2"
                    :color="layer.color"
                    :fillColor="layer.color"
                    :fillOpacity="0.2"
                    @click="(evt) => {
                        onSelectCircle(evt, circle);
                    }"
                >
                    <l-popup
                        :content="getContentTooltip(circle, layer)"
                    >
                    </l-popup>
                </l-circle>

            </l-feature-group>

        </l-map>
    </div>
</template>

<style scoped>
    .my-map {
        height: 600px;
        width: 50%;
        box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
    }
</style>
