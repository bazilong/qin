// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './theme/index.css'
import '../static/GlobalStyle.css'

import Vue from 'vue'
import VueRouter from 'vue-router'
import router from './router'
import ElementUI from 'element-ui'

import App from './App.vue'

import axios from 'axios'
import qs from 'qs'

Vue.use(VueRouter)

Vue.prototype.$http = axios

axios.defaults.withCredentials = false
axios.defaults.headers['Access-Control-Allow-Origin'] = '*'
axios.defaults.baseURL = 'https://qin.twt.cn' // 关键步骤–填写后台请求统一的地址
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.post['x-csrf-token'] = localStorage.getItem('token')
Vue.config.productionTip = false

Vue.use(ElementUI, { size: 'small', zIndex: 3000 })

let vm = new Vue()
axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
    // console.log(localStorage.getItem('token'))
    // fetch(`https://qin.twtstudio.com/api.php/user/status`, {
    //   headers: {
    //     'Accept': 'application/json, text/plain, */*'
    //   }
    // }).then(function (response) {
    //   console.log(response)
    //   response.json().then(function (res) {
    //     console.log(res)
    //     console.log(res.data)
    //     let token = res.data.token
    //     console.log(token)
    // if (localStorage.getItem('token')) {
    //   config.headers['x-csrf-token'] = localStorage.getItem('token')
    // }
  }
  return config
}, (error) => {
  return Promise.reject(error)
})
axios.interceptors.response.use(
  res => {
    const headers = res.headers
    if (headers['content-type'] === 'application/octet-stream') {
      return res
    } else if (typeof res.data === 'string') {
      vm.$message.warning('请求异常！请稍后再试')
      res.processed = true
    } else if (res.status !== 200 && res.status < 300) {
      vm.$message.error('请求失败！请检查您的网络连接')
      res.processed = true
    } else {
      let data = res.data
      if (data.errno === 10051) {
        vm.$message.warning(data.errmsg)
        res.processed = true
      }
    }
    return res
  }, err => {
  let data = err.response.data
  if (data.errno === 403) {
    vm.$message.warning('访问受限')
  } else if (data.errno === 401) {
    vm.$message.warning('访问受限,请登录')
    let isAdmin = !((err.response.config.url).indexOf('admin') === -1)
    if (isAdmin) {
      vm.$router.push(`/manage`)
    } else {
      vm.$router.push(`/`)
    }
  } else if (data.errno) {
    vm.$message.warning(`[${data.errno}] ${data.errmsg}`)
  } else {
    vm.$message.error(`[HTTP ${err.response.status}] ${err.response.statusText}`)
  }
  err.response.processed = true
  return Promise.resolve(err)
})

// 待定
// let admin = []
// router.beforeEach((to, from, next) => {
//   let reject = next
//   if (to.meta.login && to.meta.manage) {
//     if (!admin) {
//       vm.$messgae.warning('请登录管理后台')
//       router.push(`/manage`)
//       reject(false)
//     } else {
//       next()
//     }
//   } else if (to.meta.manage) {
//     vm.manage = true
//     next()
//   } else {
//     next()
//   }
// })

/* eslint-disable no-new */
vm = new Vue({
  data () {
    return {
      a: {
        adminname: 'libingxuan',
        role: '',
        admininfo: '',
        job: []
      },
      manage: false,
      managePage: false
    }
  },
  methods: {
    fetchAdmin () {
      this.$http.get(`api.php/admin/info`).then(res => {
        if (res.data.data) {
          this.a.adminname = res.data.data.info[0]
          this.a.admininfo = res.data.data.info[1]
          this.a.role = res.data.data.role
          this.a.job = res.data.data.job
        } else {
          this.a.adminname = ''
          this.a.admininfo = ''
          this.a.role = ''
        }
        this.judgeStatus(this.a.role)
      })
    },
    adminLogin (username, password) {
      let loading = this.$loading()
      this.$http.post(`api.php/admin/login`, {
        username: username,
        password: password
      }).then(res => {
        if (!res.data.data) {
          this.$message.error('登录失败')
          loading.close()
        } else {
          this.fetchAdmin()
          loading.close()
        }
      })
    },
    adminLogout () {
      this.$http.get(`/api.php/admin/logout`).then(res => {
        window.localStorage.removeItem('currentPage')
        window.localStorage.removeItem('currentPage1')
        window.localStorage.removeItem('form_id')
        this.$message.success('成功登出')
        this.$router.push(`/manage`)
        this.a = {
          adminname: '',
          role: '',
          admininfo: '',
          job: []
        }
      })
    },
    judgeStatus (data) {
      if (data === '1') {
        this.$router.push(`managepage/rights`)
      } else if (data === '2') {
        this.$router.push(`managepage/applicant`)
      } else {
        this.$message.error('出错了///')
      }
    }
  },
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})
