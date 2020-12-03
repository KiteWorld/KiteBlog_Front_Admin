import axios from "axios"

export function adminLogin(param) {
	const url = `auth/adminLogin`;
	return axios.post(url, param).then((res) => {
		return Promise.resolve(res.data)
	})
}
export function getUsers(param) {
	const url = `users/queryUsers`;
	return axios.get(url, {
		params: param
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}
export function updateUserStatus(param) {
	const url = `users/updateStatus`;
	return axios.post(url, param).then((res) => {
		return Promise.resolve(res.data)
	})
}
export function deleteUsers(param) {
	const url = `users/deleteUsers`;
	return axios.post(url, param).then((res) => {
		return Promise.resolve(res.data)
	})
}

//Table组件公用
export function getTableData(url, param) {
	return axios.get(url, {
		params: param
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}