/* Libs */
import Vue from 'vue';
import VueRouter from 'vue-router';

/* Views */
import Dashboard from './components/Dashboard';

Vue.use(VueRouter);

export default new VueRouter({

  mode: 'history',

  routes: [{
    path: '*',
    redirect: '/dashboard',
    component: Dashboard
  }, {
    path: '/dashboard',
    component: Dashboard
  }]
});