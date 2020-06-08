<script>

export default {
  name: 'data-bar',
  data() {
    return {
      options: [{
        disabled: true,
        name: 'Hospitalized',
        id: 'hosp',
        data: 17135,
        icon: 'local_hospital',
      }, {
        disabled: true,
        name: 'Critical care',
        id: 'rea',
        data: 1655,
        icon: 'local_hotel',
      }, {
        disabled: true,
        name: 'Healed',
        id: 'rad',
        data: 64617,
        icon: 'house',
      }, {
        disabled: false,
        name: 'Deaths',
        id: 'dc',
        data: 28367,
        icon: 'sentiment_very_dissatisfied'
      }]
    }
  },
}
</script>

<template>
  <div class="data-bar-container">
    <div
        v-for="(opt, index) in options"
        :key="index"
        class="data-bar"
    >

      <p class="data-bar-title">
        {{ opt.name }}
      </p>
      <p class="data-bar-data">
        {{ opt.data }}
      </p>
      <div class="data-bar-img-container">
        <i class="material-icons medium"> {{ opt.icon }} </i>
      </div>

    </div>
  </div>
</template>

<style scoped>
  .data-bar-container {
    display: flex;
    justify-content: space-around;
  }

  .data-bar {
    height: 120px;
    width: 500px;
    margin: 20px;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
    position: relative;
  }

  .data-bar-title {
    position: absolute;
    top: 0px;
    right: 15px;
    font-weight: bold;
  }

  .data-bar-data {
    position: absolute;
    top: 30px;
    right: 15px;
  }

  .data-bar-img-container {
    height: 100px;
    width: 100px;
    position: absolute;
    top: -15px;
    left: 15px;
    background-color: #e0f2f1;
  }

  i {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
  }
</style>
