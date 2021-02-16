import axios from 'axios'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import Cookies from "js-cookie"

axios.defaults.baseURL = process.env.VUE_APP_API

axios.interceptors.request.use(function (config) {
	NProgress.start()
	if (config.url !== "auth/adminLogin") {
		config.headers["authorization"] = `Bearer ${Cookies.get(
      "token"
    )}`;
	}
	return config
}, function (error) {
	console.log("error", error)
	NProgress.done()
	return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
	NProgress.done()
	return response;
}, function (error) {
	console.log("error", error)
	NProgress.done()
	return Promise.reject(error);
});