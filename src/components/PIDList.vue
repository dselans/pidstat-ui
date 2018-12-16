<template>
  <div class="PIDList">

    <!-- If a fetch resulted in an error -->
    <template v-if="dataError">
      <div class="alert alert-danger">
        <h4 class="alert-heading">Server error :(</h4>
        <p>The server returned an error when fetching data: <strong>{{ dataError }}</strong></p>
      </div>
    </template>

    <!-- If data is empty, display pretty warning message -->
    <template v-if="!data">
      <div class="alert alert-warning">
        <h4 class="alert-heading">No data (yet)</h4>
        <p class="mb-0">We do not have any PID data (yet). Don't panic. This message should disappear shortly.</p>
        <br/>
        <p>Buuuut, if this message does <strong>NOT</strong> disappear after a minute, something is probably up.</p>
        <ol type="1">
          <li>Try restarting `pidstat`</li>
          <li>Take a look at `pidstat` terminal output - look for errors, panics, etc.</li>
          <li>Open a <a href="https://github.com/dselans/pidstat/issues">Github issue</a></li>
        </ol>
      </div>
    </template>

    <form class="form-inline my-2 my-lg-0">
      <input v-model="search" class="form-control mr-sm-2" type="text" placeholder="Filter process">
      <div style="margin-left: 20px;"><strong>Last Updated:</strong> {{ lastUpdated }}</div>
    </form>
    <br/>

    <input type="radio" id="name" value="name" v-model="sortBy">
    <label for="name">Name</label>

    <input type="radio" id="pid" value="pid" v-model="sortBy">
    <label for="pid">PID</label>

    <table class="table table-hover">
      <thead>
      <tr>
        <th scope="col">PID</th>
        <th scope="col">Name</th>
        <th scope="col">Args</th>
        <th scope="col">Status</th>
        <th scope="col">Action</th>
      </tr>
      </thead>
      <tbody>

      <tr class="table" v-for="(item, index) in filteredAndSorted" :key="index">
        <th scope="row">{{ item.pid }}</th>
        <td>{{ item.name }}</td>
        <td>{{ item.cmd_line | truncate(80) }}</td>
        <td>Active</td>
        <td>Foo</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: 'PIDList',

    data() {
      return {
        data: null,
        dataError: null,
        search: '',
        fetchIntervalID: '',
        lastUpdated: 'N/A',
        sortBy: '',
      }
    },

    mounted() {
      this.startPeriodicFetch();
    },

    methods: {
      startPeriodicFetch: function() {
        this.fetchProcessList();

        this.fetchIntervalID = setInterval(() => {
          this.fetchProcessList();
        }, 3000);
      },

      fetchProcessList: function() {
        axios({method: "GET", "url": "http://localhost:8787/api/process"}).then(result => {
          this.lastUpdated = new Date().toTimeString();
          this.data = result.data;
        }, error => {
          this.dataError = error.message;
        })
      }
    },

    computed: {
      filteredAndSorted: function() {
        if (!this.data) {
          return;
        }

        // filter the data set
        var matcher = new RegExp(this.search, 'i')

        var filtered = this.data.filter(function(item){
          return matcher.test(item.name)
        });

        // sort it
        switch (this.sortBy) {
          case 'pid':
            return filtered.sort(function(a, b) {
              return b.pid - a.pid;
            });
          case 'name':
            return filtered.sort(function(a, b) {
              return ('' + a.name).localeCompare(b.name);
            });
          default:
            return filtered;
        }

        // order by
        // TODO
      },
    },

    beforeDestroy() {
      clearInterval(this.fetchIntervalID);
    },
  }
</script>

<style>
</style>
