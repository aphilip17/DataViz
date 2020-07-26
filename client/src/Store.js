/* Libs */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  selectedDept: {
    code: '',
    name: ''
  },
}

const mutations = {
  SET_DEPT: (state, dept) => {
    state.selectedDept.code = dept.code;
    state.selectedDept.name = dept.nom;
  }
}

const getters = {
  getSelectedDeptCode: (state => state.selectedDept.code),

  getSelectedDeptName: (state => state.selectedDept.name),
}
export default new Vuex.Store({

  state: state,

  mutations: mutations,

  getters: getters,

  actions: {}

})