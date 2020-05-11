<script>
import { latLng } from 'leaflet';
import { LMap, LTileLayer, LFeatureGroup, LCircle, LPopup } from 'vue2-leaflet';
import Centroid from '@turf/centroid';

export default {
    name: 'my-map',
    components: {
        LMap,
        LTileLayer,
        LFeatureGroup,
        LCircle,
        LPopup,
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
            formatDataCodiv: {}
        }
    },

    created() {
        this.displayCircles();
    },

    mounted() {
        this.$nextTick(() => {
            console.log(this.$refs.featureGroup);
        });
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
                        accu[elem.dep][elem.jour] = {
                                hosp: elem.hosp,
                                dc: elem.dc,
                                rad: elem.rad,
                                rea: elem.rea
                        }

                    } else {

                        accu[elem.dep] = {
                            [elem.jour] : {
                                hosp: elem.hosp,
                                dc: elem.dc,
                                rad: elem.rad,
                                rea: elem.rea
                            }
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

        getRadius(dep) {
            return Math.sqrt(this.formatDataCodiv[dep]['2020-05-06'].dc) * 1000;
        },

        getContentTooltip(circle) {
            const dep = circle.properties.code;

            return `<span style='color:#ff033e; font-weight: bold'> ${circle.properties.nom} ${dep} </span>
                    <div>
                        <span> Deaths: </span>
                        <span> ${this.formatDataCodiv[dep]['2020-05-06'].dc} </span>
                    </div>`
        }
    }
}
</script>

<template>
    <div class="my-map card-panel hoverable">
        <l-map
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
            <l-feature-group ref="featureGroup">
                <l-circle
                    v-for="(circle, index) in circles"
                    :key="index"
                    :lat-lng="[circle.geometry.coordinates[1], circle.geometry.coordinates[0]]"
                    :radius="getRadius(circle.properties.code)"
                    :weight="0"
                    fillColor="#ff033e"
                    :fillOpacity="0.8"

                >
                    <l-popup :content="getContentTooltip(circle)">
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
        margin: 20px;
        box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
    }
</style>
