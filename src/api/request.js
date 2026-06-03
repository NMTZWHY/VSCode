import axios from 'axios'
import Vue from 'vue'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://localhost:8000/api', // ✅ 正确的baseURL，包含/api前缀
  timeout: 15000,
  withCredentials: true // ✅ 必须开启，携带登录Cookie
})

// 获取Cookie中的csrftoken
function getCookie(name) {
  let value = null
  if (document.cookie) {
    document.cookie.split(';').forEach(item => {
      const arr = item.trim().split('=')
      if (arr[0] === name) value = decodeURIComponent(arr[1])
    })
  }
  return value
}

// 请求拦截器：自动携带Django CSRF Token
service.interceptors.request.use(config => {
  if (config.method.toLowerCase() !== 'get') {
    const token = getCookie('csrftoken')
    if (token) {
      config.headers['X-CSRFToken'] = token
    }
  }
  return config
}, err => {
  console.error('请求拦截器错误：', err)
  Vue.prototype.$message.error('请求发送失败，请检查网络')
  return Promise.reject(err)
})

// 响应拦截器
service.interceptors.response.use(
  // 请求成功：直接返回后端数据（剥离axios包装层）
  res => res.data,
  
  // 请求失败：统一错误处理
  err => {
    // 1. 处理网络错误和超时
    if (!err.response) {
      if (err.message.includes('timeout')) {
        Vue.prototype.$message.error('请求超时，请稍后重试')
      } else {
        Vue.prototype.$message.error('网络错误，请检查网络连接')
      }
      return Promise.reject(err)
    }

    // 2. 处理401未授权错误
    if (err.response.status === 401) {
      // 精确匹配登录接口（避免误判）
      const isLoginApi = err.config.url === '/login/'
      
      if (!isLoginApi) {
        // 非登录接口：清除登录状态并跳转到登录页
        localStorage.removeItem('user')
        Vue.prototype.$message.warning('登录已过期，请重新登录')
        window.location.href = '/login/'
      }else{
        console.log('request.js输出:'+err.response.data.msg)
        Vue.prototype.$message.error(err.response.data.msg)
      }
    } 
    // 3. 处理其他错误状态码
    else {
      // 优先显示后端返回的错误信息
      if (err.response.data?.msg) {
        Vue.prototype.$message.error(err.response.data.msg)
      } else {
        Vue.prototype.$message.error(`请求失败，状态码：${err.response.status}`)
      }
    }

    return Promise.reject(err)
  }
)

export default service