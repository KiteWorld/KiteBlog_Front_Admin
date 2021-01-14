import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from "@/store"
import 'normalize.css' //清除自带样式
import '@/plugins/elementui.js'
import 'element-ui/lib/theme-chalk/index.css'; //elementui 样式
import '@/theme/app.less'
import axios from 'axios'
import Cookies from "js-cookie"
import SearchInput from "@/components/SearchInput"
import Table from "@/components/Table"


axios.defaults.baseURL = "http://localhost:1874"

Vue.config.productionTip = false
Vue.component('Table', Table);
Vue.component('SearchInput', SearchInput);

axios.interceptors.request.use(function (config) {
  if (config.url !== "auth/adminLogin") {
    config.headers["authorization"] = `Bearer ${Cookies.get(
      "token"
    )}`;
  }
  return config
}, function (error) {
  console.log(error)
  return Promise.reject(error);
});



new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')