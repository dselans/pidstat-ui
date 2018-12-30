<template>
  <div class="small">
    <line-chart :chart-data="datacollection" :height="100" :options="options"></line-chart>
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
        datacollection: null,
        metrics: {
          cpu: [],
          memory: [],
        },
        options: {
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                displayFormats: {
                  minute: 'h:mm a'
                },
                unit: 'minute',
              },
              ticks: {
                autoSkip: false,
                maxTicksLimit: 6
              }
            }]
          },
          elements: {
            point: {
              radius: 1
            }
          }
        }
      }
    },

    mounted () {
      this.fillData();
      this.asyncDataUpdate();
    },
    methods: {
      fillData () {
        this.datacollection = {
          labels: this.getLabels(5),
          datasets: [
            {
              label: 'CPU',
              backgroundColor: '#7382ff',
              data: this.generateData('cpu'),
              fill: false,
              hidden: true
            },
            {
              label: 'Memory',
              backgroundColor: '#af5da5',
              data: this.generateData('memory'),
            }
          ]
        }
      },

      generateData: function(t) {
        this.metrics[t].push({
          x: function() { return new Date; }(),
          y: this.getRandomInt(),
        });

        return this.metrics[t];
      },

      getRandomInt () {
        return Math.floor(Math.random() * (50 - 5 + 1)) + 5
      },

      getLabels: function(interval) {
        const currDate = new Date;
        let labels = [];
        let i;

        for (i = 1; i < 7; i++ ) {
          labels.push(this.moment(currDate).subtract(interval*i, 'minutes'));
        }

        return labels
      },

      asyncDataUpdate() {
        this.intervalID = setInterval(() => {
          this.fillData();
        }, 5000);
      }
    }
  }
</script>

<style>
  .small {
    max-width: 800px;
    height:200px;
  }
</style>