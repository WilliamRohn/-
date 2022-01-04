import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/global.css'
import '@/assets/fonts/iconfont.css';
import axios from 'axios';
// 引入vue-table-with-tree组件
import TreeTable from 'vue-table-with-tree-grid';
// 引入echarts
// import ECharts from "vue-echarts";
// Vue.component('v-chart', ECharts)

// 设置默认路径、默认请求头使用Authorization字段携带token令牌
axios.defaults.baseURL = 'http://106.12.6.169:8888/api/private/v1'
// 设置拦截器,在请求头中使用Authorization字段提供token令牌
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// vue过滤器
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  // 字符串补全,月份不足两位起始位补0
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  // 字符串补全,日期不足两位起始位补0
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$axios = axios
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')