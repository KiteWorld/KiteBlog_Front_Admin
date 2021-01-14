import Vue from "vue";
import Vuex from "vuex";
import tagsView from "./modules/tagsView"
import permission from "./modules/permission"
import getters from "./getters"
Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		tagsView,
		permission
	},
	getters,
})

export default store