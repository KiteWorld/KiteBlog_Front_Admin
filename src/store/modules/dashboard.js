import {
	IS_SHOWED_NOTIFY
} from "../mutation_type"

const state = {
	isShowedNotify: false,
}

const mutations = {
	[IS_SHOWED_NOTIFY]: (state) => {
		state.isShowedNotify = true
	},
}

const actions = {
	isShowedNotify({
		commit
	}) {
		commit('IS_SHOWED_NOTIFY')
	},
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}