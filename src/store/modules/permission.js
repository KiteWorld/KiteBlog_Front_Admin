import {
	ADD_ROUTER_LIST,
	UPDATE_ROLE
} from "../mutation_type"

const state = {
	routerList: [],
	role: null,
}

const mutations = {
	[ADD_ROUTER_LIST]: (state, routerList) => {
		state.routerList = routerList
	},
	[UPDATE_ROLE]: (state, role) => {
		state.role = role
	}
}

const actions = {
	addRouterList({
		commit
	}, routerList) {
		commit('ADD_ROUTER_LIST', routerList)
	},
	updateRole({
		commit
	}, role) {
		commit("UPDATE_ROLE", role)
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}