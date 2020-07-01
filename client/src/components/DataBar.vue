<template>
  <div
    class="data-bar-container">
    <div
        v-for="(opt, index) in options"
        :key="index"
        class="data-bar"
        :class="dataBarImgColor(opt.id)">

      <span
        v-if="opt.data !== 0"
        class="data-bar-data">
        {{ opt.data }}
      </span>
      <span
        v-if="opt.data !== 0"
        class="data-bar-title">
        {{ opt.name }}
      </span>
      <i class="material-icons medium"> {{ opt.icon }} </i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'data-bar',
  data() {
    return {
      options: [{
        disabled: true,
        name: 'Hospitalisation',
        id: 'hosp',
        data: 0,
        icon: 'local_hospital',
      }, {
        disabled: true,
        name: 'En réanimation',
        id: 'rea',
        data: 0,
        icon: 'local_hotel',
      }, {
        disabled: true,
        name: 'Retours à domicile',
        id: 'rad',
        data: 0,
        icon: 'house',
      }, {
        disabled: false,
        name: 'Décès à l\'hopital',
        id: 'dc',
        data: 0,
        icon: 'sentiment_very_dissatisfied'
      }]
    }
  },

  mounted() {
    this.$root.$on('refresh-data', (data) => {
      this.options[0].data = data.hosp;
      this.options[1].data = data.rea;
      this.options[2].data = data.rad;
      this.options[3].data = data.dc;
    });
  },

  methods: {

    dataBarImgColor (id) {
      return {
        'data-bar-img-color-dc': id === 'dc',
        'data-bar-img-color-rea': id === 'rea',
        'data-bar-img-color-rad': id === 'rad',
        'data-bar-img-color-hosp': id === 'hosp',
      }
    }
  }
}
</script>

<style scoped>
.data-bar-container {
  display: flex;
  justify-content: flex-start;
}

.data-bar {
  height: 115px;
  width: 320px;
  margin: 20px;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
  position: relative;
  border-radius: 2px;
}

.data-bar-title {
  font-size: 15px;
  display: flex;
  justify-content: flex-start;
  margin-left: 15px;
  color: #FFFF;
}

.data-bar-data {
  font-size: 40px;
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
  margin-left: 15px;
  color: #FFFF;
}

.data-bar-img-color-dc {
    background: linear-gradient(0.25turn, #bc4e9c, #f80759);
}

.data-bar-img-color-rea {
  background: linear-gradient(0.25turn, #ffe259, #ffa751);
}

.data-bar-img-color-rad {
  background: linear-gradient(0.25turn, #78ffd6, #3cd3ad, #4cb8c4);
}

.data-bar-img-color-hosp {
  background: linear-gradient(0.25turn, #a6ffcb, #12d8fa, #1fa2ff);
}

i {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  color: white;
  right: -10px;
}
</style>
