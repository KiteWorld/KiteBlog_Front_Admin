import {
	ADD_VISITED_VIEW,
	DEL_VISITED_VIEW
} from "../mutation_type"

const state = {
	visitedViews: [],
	cacheViews: []
}

const mutations = {
	[ADD_VISITED_VIEW]: (state, view) => {
		if (state.visitedViews.some(v => v.path === view.path)) return
		state.visitedViews.push(
			Object.assign({}, view)
		)
		if (!view.onCache) state.cacheViews.push(view.name)

	},
	[DEL_VISITED_VIEW]: (state, view) => {
		const visitedIndex = state.visitedViews.findIndex(i => i.path === view.path)
		state.visitedViews.splice(visitedIndex, 1)
		if (!view.onCache) {
			const cacheIndex = state.cacheViews.findIndex(i => i.path === view.path)
			state.cacheViews.splice(cacheIndex, 1)
		}
	}
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
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}