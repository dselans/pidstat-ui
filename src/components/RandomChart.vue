<template>
  <div class="small">
    <line-chart :chart-data="datacollection" :height="100" :options="options"></line-chart>
  </div>
</template>

<script>
  import LineChart from './LineChart.js'
  import axios from 'axios';

  export default {
    name: 'RandomChart',
    components: {
      LineChart
    },
    data () {
      return {
        metricsErrors: Object,

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
          // No need for this...
          // labels: this.getLabels(5),
          datasets: this.getMetrics(1),
          // datasets: [
          //   {
          //     label: 'CPU',
          //     backgroundColor: '#7382ff',
          //     data: this.generateData('cpu'),
          //     fill: false,
          //     hidden: true
          //   },
          //   {
          //     label: 'Memory',
          //     backgroundColor: '#af5da5',
          //     data: this.generateData('memory'),
          //   }
          // ]
        }
      },

      getMetrics: function(pid) {
        let datasets = [
          {
            label: 'RSS',
            backgroundColor: '#eea054',
            data: [],
            hidden: false
          },
          {
            label: 'VMS',
            backgroundColor: '#b065a5',
            data: [],
            hidden: true,
            fill: false,
          },
          {
            label: 'SWAP',
            backgroundColor: '#e54851',
            data: [],
            hidden: true,
            fill: false,
          }
        ];

        axios({method: "GET", "url": "http://localhost:8787/api/process/" + pid}).then(result => {
          if (!('metrics' in result.data)) {
            this.metricsError[pid] = "no metrics found in data; bug?";
            return datasets;
          }

          let metricsLength = result.data.metrics.length;

          for (let i = 0; i < metricsLength; i++) {
            // RSS
            datasets[0].data.push({
              x: this.moment(result.data.metrics[i].timestamp),
              y: result.data.metrics[i].rss
            });

            // VMS
            datasets[1].data.push({
              x: this.moment(result.data.metrics[i].timestamp),
              y: result.data.metrics[i].vms
            })


            // SWAP
            datasets[2].data.push({
              x: this.moment(result.data.metrics[i].timestamp),
              y: result.data.metrics[i].swap
            })
          }
        }, error => {
          this.metricsError[pid] = error.message;
        });

        console.log("returning datasets. It looks like this:", datasets);

        return datasets;
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

        for (var i = 1; i < 7; i++ ) {
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