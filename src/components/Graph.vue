<template>
<div class="boop">
  Loading graph for {{ proc.pid }} ...
  <RandomChart/>
</div>
</template>

<script>
  import RandomChart from "./RandomChart";
  export default {
    name: "Graph",
    components: {RandomChart},
    props: {
      proc: Object,
    },

    data() {
      return {
      }
    },

    mounted() {
        this.echoStuff();
    },

    methods: {
      echoStuff: function() {
        console.log("Graph component; start displaying graph data for  " + this.proc.pid);
      }
    },

    destroyed() {
      console.log("Graph component destroyed for " + this.proc.pid);
    }

  }
</script>

<style scoped>
  .boop {
    font-size: small;
  }
</style>