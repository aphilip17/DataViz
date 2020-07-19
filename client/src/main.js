/* Libs */
import Vue from 'vue';
import VueComp from '@vue/composition-api';

/* Router */
import router from './router';

/* Store */
import Store from './Store';

/* Views */
import App from './App.vue';

/* Css/scss */
import 'leaflet/dist/leaflet.css';
import './app.scss';

Vue.config.productionTip = false;
Vue.use(VueComp);

new Vue({
  render: h => h(App),
  router,
  Store
}).$mount('#app')