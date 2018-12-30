<template>
  <div class="small">
    <line-chart :chart-data="datacollection"></line-chart>
    <button @click="fillData()">Randomize</button>
  </div>
</template>

<script>
  import LineChart from './LineChart.js'

  export default {
    name: 'RandomChart',
    components: {
      LineChart
    },
    data () {
      return {
        datacollection: null
      }
    },
    mounted () {
      this.fillData();
      this.asyncDataUpdate();
    },
    methods: {
      fillData () {
        this.datacollection = {
          labels: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
          datasets: [
            {
              label: 'CPU',
              backgroundColor: '#7382ff',
              data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
              fill: false
            },
            {
              label: 'Memory',
              backgroundColor: '#af5da5',
              data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()]
            }

          ]
        }
      },
      getRandomInt () {
        return Math.floor(Math.random() * (50 - 5 + 1)) + 5
      },

      asyncDataUpdate() {
        this.intervalID = setInterval(() => {
          this.fillData();
        }, 1000);
      }
    }
  }
</script>

<style>
  .small {
    max-width: 200px;
  }
</style>