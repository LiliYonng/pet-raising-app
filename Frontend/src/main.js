import App from './App'
import api from "./api";
// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
import uView from "uview-ui";
Vue.use(uView);
Vue.prototype.$api = api;
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif