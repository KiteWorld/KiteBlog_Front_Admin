import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from "@/store"
import 'normalize.css' //清除自带样式
import 'element-ui/lib/theme-chalk/index.css'; //elementui 样式
import '@/plugins/elementui.js' //elemenet 按组件按需导入以及组件的全局配置
import '@/styles/app.less'
import '@/utils/request' //axios 配置
import SocketService from '@/utils/webscoket' //websocket 配置
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts
import SearchInput from "@/components/SearchInput"
import Table from "@/components/Table"


Vue.config.productionTip = false
Vue.component('Table', Table);
Vue.component('SearchInput', SearchInput);

const ws = new SocketService(process.env.VUE_APP_API_WS + "dashboard")
Vue.prototype.$ws = ws;

// let setObj = new Set()
// // let arrayObj = []
// for (let index = 0; index < 10000000; index++) {
//   setObj.add(index)
//   // arrayObj.push(index)
// }
// console.log("setObj", setObj)
// // console.log("arrayObj", arrayObj)
// console.log(performance.memory)

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')