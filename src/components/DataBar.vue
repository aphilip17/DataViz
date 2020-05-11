<script>

export default {
  name: 'data-bar',
  data() {
    return {
      options: [{
        disabled: true,
        name: 'Hospitalized',
        id: 'hosp'
      }, {
        disabled: true,
        name: 'Critical care',
        id: 'rea'
      }, {
        disabled: true,
        name: 'Healed',
        id: 'rad',
      }, {
        disabled: false,
        name: 'Deaths',
        id: 'dc'
      }]
    }
  },

  methods: {
    activeData(opt) {
      opt.disabled = !opt.disabled;
      this.$root.$emit('active-data', opt.id, !opt.disabled);
    }
  }
}
</script>

<template>
  <div class="data-bar card-panel hoverable">
    <a
      v-for="(opt, index) in options"
      :key="index"
      :class="{ 'disabled-data': opt.disabled, 'btn-large': true }"
      @click="activeData(opt)"
    >
      {{ opt.name }}
    </a>
  </div>
</template>

<style scoped>
  .data-bar {
    height: 150px;
    margin: 20px;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .disabled-data {
    background-color: #DFDFDF !important;
    color: #9F9F9F !important;
  }
</style>
