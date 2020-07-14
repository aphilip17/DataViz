<template>
  <div
    class="row">
    <div
        v-for="(opt, index) in options"
        :key="index"
        class="col s12 m6 l3 data-bar-col">
      <div
        class="data-bar"
        :class="dataBarBorderLeft(opt.id)">
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
        <i class="material-icons medium"
          :class="dataBarImgColor(opt.id)"> {{ opt.icon }}
        </i>
      </div>
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
    },

    dataBarBorderLeft (id) {
      return {
        'data-bar-border-color-dc': id === 'dc',
        'data-bar-border-color-rea': id === 'rea',
        'data-bar-border-color-rad': id === 'rad',
        'data-bar-border-color-hosp': id === 'hosp',
      }
    }
  }
}
</script>

<style scoped>

.row .data-bar-col {
  padding: 0 0.3rem; /* Override materialize padding */
}

.data-bar {
  border: 1px solid #eee;
  position: relative;
  padding: 15px;
  margin-top: 15px;
}

.data-bar-title {
  font-size: 15px;
  display: flex;
  justify-content: flex-start;
  color: #233044;
}

.data-bar-data {
  font-size: 40px;
  color: #233044;
}

i {
  position: absolute;
  color: white;
  top: 50%;
  transform: translateY(-50%);
  right: 15px;
}

.data-bar-img-color-dc {
  color: #f80759;
}

.data-bar-img-color-rea {
  color: #ffa751;
}

.data-bar-img-color-rad {
  color: #3cd3ad;
}

.data-bar-img-color-hosp {
  color: #1fa2ff;
}

.data-bar-border-color-dc {
  border-left: 2px solid #f80759;
}

.data-bar-border-color-rea {
  border-left: 2px solid #ffa751;
}

.data-bar-border-color-rad {
  border-left: 2px solid #3cd3ad;
}

.data-bar-border-color-hosp {
  border-left: 2px solid #1fa2ff;
}

</style>
