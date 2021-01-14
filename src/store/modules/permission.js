import {
	ADD_ROUTER
} from "../mutation_type"

const state = {
	routerList: []
}

const mutations = {
	[ADD_ROUTER]: (state, routerList) => {
		state.routerList = routerList
	}
}

const actions = {
	addRouterList({
		commit
	}, routerList) {
		commit('ADD_ROUTER', routerList)
	},
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}