<script>
import { latLng } from 'leaflet';
import { LMap, LTileLayer } from 'vue2-leaflet';

export default {
    name: 'my-map',
    components: {
        LMap,
        LTileLayer,
    },
    data() {
        return {
            zoom: 3,
            center: latLng(47.41322, -1.219482),
            url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }
    },

    created() {
        this.getDeptsGeojson();
    },

    methods: {
        async getDeptsGeojson() {
            try {
                const response = await fetch('http://localhost:8080/depts.json');
                const depts = await response.json();
                console.log(depts);
            } catch (error) {
                console.log(error);
            }

        }
    }
}
</script>

<template>
    <div style="height: 500px; width: 50%">
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
        </l-map>
    </div>
</template>

<style>
</style>
