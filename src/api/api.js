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
export function getCategoriesList(params) {
	const url = `category/getCategoriesList`;
	return axios.get(url, {
		params: params
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}
export function getHotPointCategoriesList(params) {
	const url = `category/getHotPointCategoriesList`;
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
export function updateHotPointCategory(params) {
	const url = `category/updateHotPointCategory`;
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

export function insertHotPointCategories(params) {
	const url = `category/insertHotPointCategories`;
	return axios.post(url, params).then((res) => {
		return Promise.resolve(res.data)
	})
}

export function getHotPointCategories(params) {
	const url = `category/getHotPointCategories`;
	return axios.get(url, {
		params: params
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}
export function deleteHotPointCategory(params) {
	const url = `category/deleteHotPointCategory`;
	return axios.post(url, params).then((res) => {
		return Promise.resolve(res.data)
	})
}
export function transferHotPointCategory(params) {
	const url = `category/transferHotPointCategory`;
	return axios.post(url, params).then((res) => {
		return Promise.resolve(res.data)
	})
}
export function transferCategory(params) {
	const url = `category/transferCategory`;
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
export function queryArticleById(params) {
	const url = `article/queryArticleById`;
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
export function updateArticleCat(params) {
	const url = `article/updateArticleCat`;
	return axios.post(url, params).then((res) => {
		return Promise.resolve(res.data)
	})
}
export function updateArticleType(params) {
	const url = `article/updateArticleType`;
	return axios.post(url, params).then((res) => {
		return Promise.resolve(res.data)
	})
}
export function saveArticle(params) {
	const url = `article/saveArticle`;
	return axios.post(url, params).then((res) => {
		return Promise.resolve(res.data)
	})
}
// ------------沸点--------------
export function queryHotPoint(params) {
	const url = `hotPoint/queryHotPoint`;
	return axios.get(url, {
		params: params
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}
export function queryHotPointById(params) {
	const url = `hotPoint/queryHotPointById`;
	return axios.get(url, {
		params: params
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}
export function deleteHotPoint(params) {
	const url = `hotPoint/deleteHotPoint`;
	return axios.post(url, params).then((res) => {
		return Promise.resolve(res.data)
	})
}
export function updateHotPointCat(params) {
	const url = `hotPoint/updateHotPointCat`;
	return axios.post(url, params).then((res) => {
		return Promise.resolve(res.data)
	})
}
export function updateHotPointType(params) {
	const url = `hotPoint/updateHotPointType`;
	return axios.post(url, params).then((res) => {
		return Promise.resolve(res.data)
	})
}
export function updateHotPointStatus(params) {
	const url = `hotPoint/updateHotPointStatus`;
	return axios.post(url, params).then((res) => {
		return Promise.resolve(res.data)
	})
}
export function saveHotPoint(params) {
	const url = `hotPoint/saveHotPoint`;
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