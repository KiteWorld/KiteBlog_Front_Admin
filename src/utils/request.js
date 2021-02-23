import axios from 'axios'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import Cookies from "js-cookie"

axios.defaults.baseURL = process.env.VUE_APP_API

axios.interceptors.request.use((config) => {
	NProgress.start()
	if (config.url !== "auth/adminLogin") {
		config.headers["authorization"] = `Bearer ${Cookies.get(
      "token"
    )}`;
	}
	return config
}, (error) => {
	console.log("error", error)
	NProgress.done()
	return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
	NProgress.done()
	return response;
}, (error) => {
	if (error.response.status === 401) {
		Cookies.remove("token")
		Cookies.remove("name")
		Cookies.remove("userId")
		Cookies.remove("role")
		location.reload()
	}
	NProgress.done()
	return Promise.reject(error);
});