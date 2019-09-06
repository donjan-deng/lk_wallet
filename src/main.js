import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Web3 from "web3";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import helper from './helper/helper';
import axios from 'axios';
import store from 'store';

Vue.config.productionTip = false
Vue.use(ElementUI);

Vue.prototype.$helper = helper;
Vue.prototype.$http= axios;
Vue.prototype.$store= store;

new Vue({
  router,
  data: function () {
    return {
      wallet: null,
      web3: new Web3("https://linktoken.bihe.wrbug.cn")//new Web3("http://172.24.217.140:44000") https://lknode.lyapp.com
    }
  },
  render: h => h(App)
}).$mount('#app')
