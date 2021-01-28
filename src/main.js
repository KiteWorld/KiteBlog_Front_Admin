import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from "@/store"
import 'normalize.css' //清除自带样式
import 'element-ui/lib/theme-chalk/index.css'; //elementui 样式
import '@/plugins/elementui.js' //elemenet 按组件按需导入以及组件的全局配置
import '@/styles/app.less'
import '@/utils/request' //axios 配置

import SearchInput from "@/components/SearchInput"
import Table from "@/components/Table"

Vue.config.productionTip = false
Vue.component('Table', Table);
Vue.component('SearchInput', SearchInput);

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')