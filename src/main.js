import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
// import ElementUI from 'element-ui';
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/global.css'
import axios from 'axios';

axios.defaults.baseURL = 'http://106.12.6.169:8888/api/private/v1/login'
Vue.config.productionTip = false
Vue.prototype.$http = axios
// Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
