import {
	ADD_ROUTER_LIST,
	UPDATE_ROLE,
	ADD_ROUTER_ITEM
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
	},
	[ADD_ROUTER_ITEM]: (state, routerItem) => {
		state.routerList = routerItem
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
	},
	addRouterItem({
		commit
	}, routerItem) {
		commit("ADD_ROUTER_ITEM", routerItem)
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}