import Vue from 'vue';
import axios from 'axios';

const HTTP = axios.create({});

HTTP.interceptors.request.use(function (config) {
	const token = localStorage.getItem('token');
	if(token)
		config.headers.Authorization = `Bearer ${token}`;
	else
		config.headers.Authorization = undefined;

	// Do something before request is sent
	return config;
}, function (error) {
	// Do something with request error
	return Promise.reject(error);
});

// Add a response interceptor
HTTP.interceptors.response.use((response) => {
	return response;
}, function (error) {
	try{
		if(error.response.status == 401){
			Vue.store.commit('fm/auth/logoutSuccess');
		}
	}catch(e){}
	return Promise.reject(error);
});

export default HTTP;