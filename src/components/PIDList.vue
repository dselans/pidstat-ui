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
        <th scope="col">PID<font-awesome-icon class="sorter" v-on:click="updateSortBy('pid')" icon="sort" /></th>
        <th scope="col">Name<font-awesome-icon class="sorter" v-on:click="updateSortBy('name')" icon="sort" /></th>
        <th scope="col">Args</th>
        <th scope="col">Watched<font-awesome-icon class="sorter" v-on:click="updateSortBy('watched')" icon="sort" /></th>
      </tr>
      </thead>
      <tbody>
        <template class="table" v-for="(item, index) in filteredAndSorted">
          <tr :key="index" v-bind:class="rowClasses(item)" v-on:click="handleRow(item)">
            <th scope="row">{{ item.pid }}</th>
            <td><code>{{ item.name }}</code></td>
            <td><div class="mono">{{ item.cmd_line | truncate(80) }}</div></td>
            <td><toggle-button @change="selectProcess(item, $event)" :sync="true" :labels="{checked: 'ON', unchecked: 'OFF'}" v-model="item.watched"/></td>
          </tr>
          <tr :key="`${index}:detailed`" v-bind:class="detailViewClasses(item)">
            <td colspan="4">
              <div class="boop">Loading graphs...</div>
            </td>
          </tr>
        </template>
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
        expanded: [],
      }
    },

    mounted() {
      this.startPeriodicFetch();
    },

    methods: {
      handleRow: function(item) {
        if (!item.watched) {
          return;
        }

        console.log("this pid is actively watched; lets expand it")

        let loc = this.expanded.indexOf(item.pid);

        if (loc === -1) {
          // row is not yet expanded - expand it
          this.expanded.push(item.pid);
        } else {
          // row is already expanded - collapse it
          this.$delete(this.expanded, loc);
        }
      },

      detailViewClasses: function(item) {
        if (!item) {
          return {}
        }

        return {
          'detailView': true,
          'isClosed': !this.expanded.includes(item.pid),
        }
      },

      rowClasses: function(item) {
        if (!item) {
          return {}
        }
        return {
          'table-success': item.watched
        }
      },

      selectProcess: function(item, event) {
        console.log("got hit");

        if (!event) {
          return
        }

        console.log("Changing state to '" + event.value + "' for pid '" + item.pid + "'");

        let methodStr = "POST";

        if (!event.value) {
          methodStr = "DELETE";
        }

        axios({method: methodStr, "url": "http://localhost:8787/api/process/" + item.pid}).then(result => {
          console.log("successfully started watch for pid " + item.pid);
        }, error => {
          console.log("unable to start watch for " + item.pid + ": "+ error);
        })

      },

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
          case 'watched':
            filtered = filtered.sort(function(a, b) {
              return (a === b)? 0 : a? -1 : 1;
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
  .detailView td:hover {
    background: #ffffff;
  }

  .detailView {
    text-align: center;
  }

  .isClosed  {
    visibility: collapse;
  }

  code {
    font-family: monospace;
  }

  .mono {
    font-family: monospace;
    font-size: 10px;
  }

  .sorter {
    margin-left: 5px;
    cursor: pointer;
  }
</style>
