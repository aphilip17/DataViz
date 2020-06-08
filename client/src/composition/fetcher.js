import { ref } from '@vue/composition-api';
import Centroid from '@turf/centroid';
import CovidServices from '../services/CovidServices';

export function useFetchGeojson(url) {

    const data = ref([]);

    const fetchData = async function() {
        try {
            const response = await fetch(url);
            data.value = await response.json();

        } catch (error) {
            console.log(error);
        }
    }

    return {
        data,
        fetchData
    }
}

export function useFetchDataCovid() {

    const data = ref([]);

    const formatData = function(resp) {
        data.value = resp.reduce((accu, elem) => {

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
    }

    const fetchData = async function() {
        try {
            const res = await CovidServices.getHospData();
            const resData = res.data;

            formatData(resData);

        } catch (error) {
            console.log(error);
        }
    }

    return {
        data,
        fetchData
    }
}

/* Should be in a helper file. */
export function useGetPolygonCentroid(polygons) {

    const centroid = ref([]);

    const getCentroid = function() {
        centroid.value = polygons.value.features.map((dpt) => {
            return Centroid(dpt, dpt.properties);
        });
    }

    return {
        centroid,
        getCentroid
    }
}