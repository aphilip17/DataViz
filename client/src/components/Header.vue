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
          to="/dashboard/department"> > {{ department }}
        </router-link>
      </div>
    </div>
    <div class="divider"></div>
  </div>
</template>

<script>

export default {
  name: 'header-dash',

  data() {
    return {
      deptLink: false,
      department: '',
    }
  },

  mounted() {
    this.$root.$on('select-department', (circle) => {
      this.department = circle.nom;
    });

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
