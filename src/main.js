import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import 'normalize.css' //清楚自带样式
import '@/plugins/elementui.js'
import 'element-ui/lib/theme-chalk/index.css'; //elementui 样式
import '@/theme/app.less'
import axios from 'axios'
import Cookies from "js-cookie"

axios.defaults.baseURL = "http://localhost:1874"

Vue.config.productionTip = false

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
  router
}).$mount('#app')