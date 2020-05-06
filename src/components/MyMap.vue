<script>
import { latLng } from 'leaflet';
import { LMap, LTileLayer, LFeatureGroup, LCircle } from 'vue2-leaflet';
import Centroid from '@turf/centroid';

export default {
    name: 'my-map',
    components: {
        LMap,
        LTileLayer,
        LFeatureGroup,
        LCircle,
    },
    data() {
        return {
            zoom: 3,
            center: latLng(47.41322, -1.219482),
            url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19,
            depts: {},
            circles: []
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

        async displayCircles() {
            await this.getDeptsGeojson();
            this.circles = this.depts.features.map((dpt) => {
                return Centroid(dpt, dpt.properties);
            });

            console.log(this.circles);
        }
    }
}
</script>

<template>
    <div style="height: 500px; width: 100%">
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
                    :radius="4500"
                    color="red"
                >
                </l-circle>

            </l-feature-group>

        </l-map>
    </div>
</template>

<style>
</style>
