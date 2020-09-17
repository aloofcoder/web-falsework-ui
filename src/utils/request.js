import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
var msgStack = false

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (getToken()) {
      // let each request carry token
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== '00000') {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    let msg
    let isLogin = false
    if (error && error.response && error.response.status) {
      let status = error.response.status
      switch (status) {
        case 401:
          isLogin = true
          msg = '登录已失效'
          break
        case 404:
          msg = '无效的请求地址'
          break
        default:
          msg = error.message
      }
    } else {
      msg = '系统错误,请稍后重试'
    }
    Message({
      message: msg,
      type: 'error',
      duration: 5 * 1000
    })
    if (isLogin) {
      removeToken()
      router.replace(`/login?${router.currentRoute.path}`)
      return Promise.reject(new Error(msg))
    }
    return Promise.reject(error)
  }
)

export default service
