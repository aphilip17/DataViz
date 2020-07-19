/* Utils */
import Api from './Api';

export default {
  getHospData() {
    return Api().get('/covid');
  },

  getDepts() {
    return Api().get('/depts');
  },

  getHospDataDept(deptId) {
    console.log(deptId)
    return Api().get('/covidDept', { params: { id: deptId }});
  },
}