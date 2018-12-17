import Vue from 'vue'
import App from './App.vue'
import router from './router'

// Bootstrap
require("./assets/css/bootstrap.min.css")

// Font-awesome icon(s)
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSort } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faSort)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// Pretty on/off toggle button
import ToggleButton from 'vue-js-toggle-button'
Vue.use(ToggleButton)

// Automatically trunc strings that are longer than X
var VueTruncate = require('vue-truncate-filter')
Vue.use(VueTruncate)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
