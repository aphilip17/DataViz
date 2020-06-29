<template>
  <div class="data-bar-container">
    <div
        v-for="(opt, index) in options"
        :key="index"
        class="data-bar">
      <p
        v-if="opt.data !== 0"
        class="data-bar-data">
        {{ opt.data }}
      </p>
      <p
        v-if="opt.data !== 0"
        class="data-bar-title">
        {{ opt.name }}
      </p>
      <div
        class="data-bar-spinner"
        v-else
      >
        <div class="preloader-wrapper big active">
          <div class="spinner-layer spinner-green-only">
            <div class="circle-clipper left">
              <div class="circle"></div>
            </div>
            <div class="gap-patch">
              <div class="circle"></div>
            </div>
            <div class="circle-clipper right">
              <div class="circle"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="data-bar-img-container">
        <i class="material-icons medium"> {{ opt.icon }} </i>
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
  }
}
</script>

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
  font-size: 15px;
  display: flex;
  justify-content: flex-end;
  margin-right: 15px;
  margin-top: 0px;
}

.data-bar-data {
  font-size: 50px;
  color: grey;
  display: flex;
  justify-content: flex-end;
  margin: 0px 0px;
  margin-right: 15px;
}

.data-bar-spinner {
  display: flex;
  justify-content: center;
  /*align-items: center;*/ /* Does not work. I don't know why ? */
  margin-top: 25px;
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
