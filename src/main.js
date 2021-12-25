import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/global.css'
import '@/assets/fonts/iconfont.css';
import axios from 'axios';

// 设置默认路径、默认请求头使用Authorization字段携带token令牌
axios.defaults.baseURL = 'http://106.12.6.169:8888/api/private/v1'
axios.defaults.headers.common['Authorization'] = window.sessionStorage.getItem('token');
// 设置拦截器,在请求头中使用Authorization字段提供token令牌
// axios.interceptors.request.use(config => {
//   config.headers.Authorization = window.sessionStorage.getItem('token')
//   return config
// })
Vue.config.productionTip = false
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')