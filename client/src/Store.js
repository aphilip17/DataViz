/* Libs */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  selectedDept: {
    code: '',
    name: ''
  },

  dataCovid: {},

  dataCovidDept: [],

  deptsGeojson: {},

  circles: [],
}

const mutations = {
  SET_DEPT: (state, dept) => {
    state.selectedDept.code = dept.code;
    state.selectedDept.name = dept.nom;
  },

  SET_DATA_CODIV: (state, data) => {
    state.dataCovid = data;
  },

  SET_DATA_CODIV_DEPT: (state, data) => {
    state.dataCovidDept.push(data);
  },

  SET_DEPTS_GEOJSON: (state, data) => {
    state.deptsGeojson = data;
  },

  SET_CIRCLES: (state, data) => {
    state.circles = data;
  }
}

const getters = {
  getSelectedDeptCode: (state => state.selectedDept.code),

  getSelectedDeptName: (state => state.selectedDept.name),

  getDataCovid: (state => state.dataCovid),

  getDataCodivDept: (state) => (code) => {
    return state.dataCovidDept.find(dept => dept.code === code);
  },

  getDeptsGeojson: (state => state.deptsGeojson),

  getCircles: (state => state.circles),
}

export default new Vuex.Store({

  state: state,

  mutations: mutations,

  getters: getters,

  actions: {}

})