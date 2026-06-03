import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  // ✅ 新增：用户中心页面（必须登录才能访问）
  {
    path: '/user',
    name: 'User',
    component: () => import('../views/UserPage.vue'), // 对应你之前创建的用户页面文件
    meta: { requireAuth: true } // 标记：需要登录权限
  },
  {
    path: '/apply',
    name: 'Apply',
    component: () => import('../views/Apply.vue'),
    // meta: { requireAuth: true }
  },
  {
    path: '/institution',
    name: 'Institution',
    component: () => import('../views/Institution.vue')
  },
  {
    path: '/overview',
    name: 'Overview',
    component: () => import('../views/Overview.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// ✅ 新增：全局路由守卫（登录权限校验核心）
router.beforeEach((to, from, next) => {
  // 判断目标页面是否需要登录
  if (to.meta.requireAuth) {
    // 从本地存储获取用户登录信息（和登录页逻辑保持一致）
    const userInfo = localStorage.getItem('user')
    
    if (userInfo) {
      // 已登录 → 放行
      next()
    } else {
      // 未登录 → 跳转到登录页，并提示
      next('/login')
      Vue.prototype.$message.warning('请先登录后访问')
    }
  } else {
    // 不需要登录权限 → 直接放行
    next()
  }
})

export default router