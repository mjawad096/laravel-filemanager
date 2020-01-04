/* eslint-disable-next-line */
import '@babel/polyfill';
import Vue from 'vue';
import Vuex from 'vuex';
// store
import fm from './store';
// App
import App from './App.vue';
// import App from './FileManager.vue';

Vue.use(Vuex);

// create new store
const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: { fm },
});

Vue.store = store;

Vue.config.productionTip = process.env.NODE_ENV === 'production';

new Vue({
// new Vue({
  store,
  render: h => h(App),
}).$mount('#fm');
