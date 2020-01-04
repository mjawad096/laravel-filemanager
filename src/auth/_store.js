import axios from 'axios';

const token = localStorage.getItem('token');

export default {
    namespaced: true,
    state: {
    	loggedIn: token ? true : false,
        token: token,
        errors: {
            email: [],
            password: [],
        },
    },
    actions: {
        login({ state, dispatch, commit }, { email, password }) {
            axios.post('api/auth/login', { email, password }).then((response)=>{
            	try{
                    let _token = response.data.access_token;
            		if(_token){
            			commit('loginSuccess', _token);
            		}
            	}catch(e){
            		commit('logoutSuccess');
            	}
            }).catch((error)=>{
                var response = error.response || {data: {}};
                if(response.status == 422 || response.status == 400){
                    commit('setErrors', response.data.errors || {
                        email: [],
                        password: [],
                    });
                }
                response.data.message && alert(response.data.message);
            	commit('logoutSuccess');
            });
        },
        logout({ state, commit }) {
        	axios.post('api/auth/logout', {}, {headers: {Authorization: `Bearer ${state.token}`}}).then((response)=>{
        		commit('logoutSuccess');
        	}).catch((error)=>{
        		commit('logoutSuccess');
        	});
        }
    },
    mutations: {
        setErrors(state, errors){
            state.errors.email = errors.email || [];
            state.errors.password = errors.password || [];
        },  

        removeError(state, field){
            state.errors[field] = [];
        },

        loginSuccess(state, token) {
            state.loggedIn = true;
            state.token = token;
            localStorage.setItem('token', token);
        },

        logoutSuccess(state) {
            state.loggedIn = false;   
            state.token = token;         
            localStorage.removeItem('token');
        }
    }
}

