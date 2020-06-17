/* Libs */
import { ref } from '@vue/composition-api';
import Centroid from '@turf/centroid';

/* Utils */
import CovidServices from '../services/CovidServices';

export function useFetchGeojson() {

	const data = ref([]);

	const fetchData = async function() {
		try {
			const res = await CovidServices.getDepts();
			data.value = res.data;

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

	const fetchData = async function() {
		try {
			const res = await CovidServices.getHospData();
			data.value = res.data;

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