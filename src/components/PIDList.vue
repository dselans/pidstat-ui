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

    <table class="table table-hover">
      <thead>
      <tr>
        <th scope="col">PID<font-awesome-icon v-on:click="updateSortBy('pid')" style="margin-left: 5px" icon="sort" /></th>
        <th scope="col">Name<font-awesome-icon v-on:click="updateSortBy('name')" style="margin-left: 5px" icon="sort" /></th>
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
        <td>{{ item.watched }}</td>
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
        sortAsc: false,
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

          // reset dataError (if it was ever set)
          this.dataError = null;
        }, error => {
          this.dataError = error.message;
        })
      },

      updateSortBy: function(field) {
        if(field === this.sortBy){
          this.sortAsc = !this.sortAsc
        }else{
          this.sortBy = field;
          this.sortAsc = true;
        }
      },
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
            filtered = filtered.sort(function(a, b) {
              return b.pid - a.pid;
            });
            break;
          case 'name':
            filtered = filtered.sort(function(a, b) {
              return ('' + a.name).localeCompare(b.name);
            });
            break;
        }

        if (this.sortAsc) {
          return filtered.reverse();
        }

        return filtered;
      },
    },

    beforeDestroy() {
      clearInterval(this.fetchIntervalID);
    },
  }
</script>

<style>
</style>
