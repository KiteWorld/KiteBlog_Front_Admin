import {
	ADD_VISITED_VIEW,
	DEL_VISITED_VIEW,
	DEL_ORTHERS_VIEW,
	DEL_ALL_VIEW
} from "../mutation_type"

const state = {
	visitedViews: [],
	cachedViews: []
}

const mutations = {
	[ADD_VISITED_VIEW]: (state, view) => {
		if (state.visitedViews.some(v => v.path === view.path)) return
		state.visitedViews.push(
			Object.assign({}, view)
		)
		if (!view.meta.noCache) state.cachedViews.push(view.name)
	},
	[DEL_VISITED_VIEW]: (state, view) => {
		const visitedIndex = state.visitedViews.findIndex(i => i.path === view.path)
		state.visitedViews.splice(visitedIndex, 1)
		if (!view.meta.noCache) {
			const cacheIndex = state.cachedViews.findIndex(i => i.path === view.path)
			state.cachedViews.splice(cacheIndex, 1)
		}
	},
	[DEL_ORTHERS_VIEW]: (state, view) => {
		const visitedViews = state.visitedViews.filter(x => x.meta.isAffix || x.name === view.name)
		state.visitedViews = visitedViews
	},
	[DEL_ALL_VIEW]: (state) => {
		const visitedViews = state.visitedViews.filter(x => x.meta.isAffix)
		state.visitedViews = visitedViews
	},
}

const actions = {
	addVisitedView({
		commit
	}, view) {
		commit('ADD_VISITED_VIEW', view)
	},
	delVisitedView({
		commit
	}, view) {
		commit('DEL_VISITED_VIEW', view)
	},
	delOthersView({
		commit
	}, view) {
		commit('DEL_ORTHERS_VIEW', view)
	},
	delAllView({
		commit
	}, view) {
		commit('DEL_ALL_VIEW', view)
	},
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}