import axios from 'axios'
import Vue from 'vue'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 15000,
  withCredentials: true // 携带Cookie、Session、CSRF Cookie
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
  // 登录、注册接口 不附加CSRF
  const skipCsrfList = ['/login/', '/register/']
  const isSkipCsrf = skipCsrfList.some(path => config.url.includes(path))

  // 非GET、非跳过接口，附加CSRF
  if (!isSkipCsrf && config.method.toLowerCase() !== 'get') {
    const token = getCookie('csrftoken')
    if (token) {
      config.headers['X-CSRFToken'] = token
    }
  }

  // ========== 关键修复：文件上传自动清空Content-Type ==========
  // 上传文件时，让axios自动设置 multipart/form-data，不要手动指定
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }

  return config
}, err => {
  console.error('请求拦截器错误：', err)
  Vue.prototype.$message.error('请求发送失败，请检查网络')
  return Promise.reject(err)
})

// 响应拦截器
service.interceptors.response.use(
  res => res.data,
  err => {
    // 1. 网络/超时错误
    if (!err.response) {
      if (err.message.includes('timeout')) {
        Vue.prototype.$message.error('请求超时，请稍后重试')
      } else {
        Vue.prototype.$message.error('网络错误，请检查网络连接')
      }
      return Promise.reject(err)
    }

    // 2. 401 未登录/登录失败
    if (err.response.status === 401) {
      const isLoginApi = err.config.url === '/login/'
      if (!isLoginApi) {
        localStorage.removeItem('user')
        Vue.prototype.$message.warning('登录已过期，请重新登录')
        window.location.href = '/login/'
      } else {
        Vue.prototype.$message.error(err.response.data?.msg || '用户名或密码错误')
      }
    }
    // 3. 403 权限不足（管理员接口、未授权访问）
    else if (err.response.status === 403) {
      Vue.prototype.$message.error(err.response.data?.msg || '暂无权限访问')
    }
    // 4. 其他状态码
    else {
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