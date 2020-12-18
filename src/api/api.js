import axios from "axios"

export function adminLogin(params) {
	const url = `auth/adminLogin`;
	return axios.post(url, params).then((res) => {
		return Promise.resolve(res.data)
	})
}
export function getUsers(params) {
	const url = `users/queryUsers`;
	return axios.get(url, {
		params: params
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}
export function updateUserStatus(params) {
	const url = `users/updateStatus`;
	return axios.post(url, params).then((res) => {
		return Promise.resolve(res.data)
	})
}
export function deleteUsers(params) {
	const url = `users/deleteUsers`;
	return axios.post(url, params).then((res) => {
		return Promise.resolve(res.data)
	})
}

//------------分类--------------
export function getCategories(params) {
	const url = `category/getCategories`;
	return axios.get(url, {
		params: params
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}
export function updateCategoryOrder(params) {
	const url = `category/updateCategoryOrder`;
	return axios.get(url, {
		params: params
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}
export function insertCategories(params) {
	const url = `category/insertCategories`;
	return axios.post(url, params).then((res) => {
		return Promise.resolve(res.data)
	})
}
export function updateCategory(params) {
	const url = `category/updateCategory`;
	return axios.post(url, params).then((res) => {
		return Promise.resolve(res.data)
	})
}
export function deleteCategory(params) {
	const url = `category/deleteCategory`;
	return axios.post(url, params).then((res) => {
		return Promise.resolve(res.data)
	})
}

// ---------文章---------

export function queryArticles(params) {
	const url = `article/queryArticles`;
	return axios.get(url, {
		params: params
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}
export function deleteArticle(params) {
	const url = `article/deleteArticle`;
	return axios.post(url, params).then((res) => {
		return Promise.resolve(res.data)
	})
}
export function auditedAticle(params) {
	const url = `article/auditedAticle`;
	return axios.post(url, params).then((res) => {
		return Promise.resolve(res.data)
	})
}
export function rejectArticle(params) {
	const url = `article/rejectArticle`;
	return axios.post(url, params).then((res) => {
		return Promise.resolve(res.data)
	})
}

//Table组件公用
export function getTableData(url, params) {
	return axios.get(url, {
		params: params
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}