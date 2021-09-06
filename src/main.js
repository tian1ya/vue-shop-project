import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

// 导入全局样式
import './assets/css/global.css'

// 导入字体图标
import './assets/fonts/iconfont.css'

// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

// 全局过滤器
Vue.filter('dataFormater', function(originalVal) {
  const dt = new Date(originalVal)
  const year = dt.getFullYear()
  const month = (dt.getMonth() + 1 + '').padStart(2, '0')
  const day = (dt.getDate() + '').padStart(2,'0')
  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')

  return `${year}-${month}-${day} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
