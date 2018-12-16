import Vue from 'vue'
import App from './App.vue'
import router from './router'

var VueTruncate = require('vue-truncate-filter')
Vue.use(VueTruncate)

require("./assets/css/bootstrap.min.css")

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
