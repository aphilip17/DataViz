import Api from './Api';

export default {
    getHospData() {
        return Api().get('/covid');
    },

    getDepts() {
        return Api().get('/depts');
    }
}