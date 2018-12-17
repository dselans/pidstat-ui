import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSort } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSort)

var VueTruncate = require('vue-truncate-filter')
Vue.use(VueTruncate)

Vue.component('font-awesome-icon', FontAwesomeIcon)

require("./assets/css/bootstrap.min.css")

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
