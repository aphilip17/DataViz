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

	const formatData = function(resp) {
		data.value = resp.reduce((accu, elem) => {

			if (elem.sex !== 0) {
				return accu;
			}

			if (accu[elem.dept]) {
				accu[elem.dept].dates.push(elem.date);
				accu[elem.dept].hosp.push(elem.hosp);
				accu[elem.dept].dc.push(elem.dc);
				accu[elem.dept].rad.push(elem.rad);
				accu[elem.dept].rea.push(elem.rea);
			} else {
				accu[elem.dept] = {
						dates: [elem.date],
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