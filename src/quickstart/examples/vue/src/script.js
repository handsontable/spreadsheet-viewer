import '@babel/polyfill';
import Vue from 'vue';
import App from './App.vue';

const vm = new Vue({
  el: '#app',
  render(h) {
    return h(App);
  }
});
