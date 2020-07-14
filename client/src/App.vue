<script>

import HeaderBar from '@/components/Header.vue';

export default {
  components: {
    HeaderBar
  },

}

</script>

<template>
  <div id="app">
    <div>
      <header-bar></header-bar>
    </div>
    <router-view></router-view>
  </div>
</template>

