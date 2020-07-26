<template>
  <div>
    <div class="row header">
      <div class="col s2">
        <p> Dashboard </p>
      </div>
      <div class="col s4 links">
        <router-link
          to="/dashboard"> France
        </router-link>
        <router-link
          v-show="deptLink"
          to="/dashboard/department"> > {{ getDept }}
        </router-link>
      </div>
    </div>
    <div class="divider"></div>
  </div>
</template>

<script>
/* Utils */
import store from '../Store.js';

export default {
  name: 'header-dash',

  data() {
    return {
      deptLink: false,
    }
  },

  computed: {
    getDept: function () {
      return this.$store.getters.getSelectedDeptName;
    }
  },

  store: store,

  mounted() {

    this.$router.afterEach((to) => {
      switch (to.name) {
        case 'dashboard':
          this.deptLink = false;
          break;
        case 'department':
          this.deptLink = true;
          break;
      }
    })
  }
}
</script>

<style scoped>
.header {
  margin-bottom: 0; /* override materialize css */
}

p {
  color: #233044;
  font-weight: 700;
  margin-left: 15px;
  margin-right: 15px;
}

.links {
  margin-top: 15px;
}

</style>
