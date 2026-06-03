import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'animate.css/animate.min.css'
import 'quill/dist/quill.snow.css'
import VueCookies from 'vue-cookies'

import HorizontalTree from '@/components/HorizontalTree/HorizontalTree'
Vue.use(HorizontalTree)

Vue.use(ElementUI)
Vue.use(VueCookies)

// 全局事件总线
Vue.prototype.$bus = new Vue()
Vue.prototype.$confirm = ElementUI.MessageBox.confirm

// ✅ 核心：重写全局$message方法，实现真正的全局统一配置
const originalMessage = ElementUI.Message

// 创建自定义Message方法，自动注入全局配置
const customMessage = function(options) {
  // 兼容两种调用方式：this.$message('文本') 和 this.$message({...})
  if (typeof options === 'string') {
    options = { message: options }
  }

  // 全局默认配置（所有消息自动生效）
  const globalConfig = {
    offset: 75, // 垂直偏移，完美避开Header
    zIndex: 999999, // 绝对最高层级，不会被任何元素遮挡
    duration: 3000, // 显示时长3秒
    showClose: true // 显示关闭按钮
  }

  // 合并配置：用户传入的参数会覆盖全局默认
  const finalConfig = Object.assign({}, globalConfig, options)

  // 调用原生Message方法
  return originalMessage(finalConfig)
}; // ✅ 关键：这里必须加分号！解决ASI问题

// ✅ 数组前也加分号，双重保险
;['success', 'warning', 'error', 'info'].forEach(type => {
  customMessage[type] = function(options) {
    if (typeof options === 'string') {
      options = { message: options }
    }
    options.type = type
    return customMessage(options)
  }
})

// 复制closeAll方法
customMessage.closeAll = originalMessage.closeAll

// 挂载到Vue原型，替换原来的$message
Vue.prototype.$message = customMessage

// 导入我们在request.js中封装好的axios实例
import axios from './api/request'

// 将封装好的axios实例挂载到Vue原型
Vue.prototype.$axios = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')