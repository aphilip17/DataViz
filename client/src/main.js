import Vue from 'vue';
import VueComp from '@vue/composition-api';
import router from './router';

import App from './App.vue';

import 'leaflet/dist/leaflet.css'
import './app.scss';

Vue.config.productionTip = false
Vue.use(VueComp);

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')