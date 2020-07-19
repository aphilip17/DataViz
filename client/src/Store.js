/* Libs */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  selectedDept: '',
}

const mutations = {
  SET_DEPT: (state, dept) => {
    state.selectedDept = dept;
  }
}

const getters = {
  getSelectedDept: (state => state.selectedDept)
}
export default new Vuex.Store({

  state: state,

  mutations: mutations,

  getters: getters,

  actions: {}

})