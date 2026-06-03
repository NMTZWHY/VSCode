<template>
  <header class="header">
    <div class="logo">科研机构管理平台</div>
    <nav class="nav">
      <router-link to="/" exact>首页</router-link>
      <router-link to="/overview">平台概况</router-link>
      <router-link to="/institution">入驻机构</router-link>
      <router-link to="/apply">申请入驻</router-link>

      <!-- 替换原来的"用户登录"链接 -->
      <!-- 已登录：显示头像+昵称+下拉菜单 -->
      <el-dropdown trigger="click" v-if="isLoggedIn" class="user-nav-item">
        <span class="el-dropdown-link user-dropdown">
          <img :src="user.avatar || defaultAvatar" class="user-avatar">
          <span class="user-name">{{ user.nickname || user.username }}</span>
          <i class="el-icon-arrow-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-user" @click.native="toPersonalCenter">
            个人中心
          </el-dropdown-item>
          <el-dropdown-item divided icon="el-icon-switch-button" @click.native="handleLogout">
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- 未登录：显示登录按钮 -->
      <router-link to="/login" v-else>用户登录</router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      user: {},
      isLoggedIn: false,
      // 默认头像（base64编码，无需额外图片文件）
      defaultAvatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iIzQwOWVmZiIvPjx0ZXh0IHg9IjUwIiB5PSI2NSIgZm9udC1zaXplPSI0MCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+5LqMPC90ZXh0Pjwvc3ZnPg=='
    }
  },
  created() {
    // 页面加载时检查登录状态
    this.checkLoginStatus()
    // 监听登录成功事件
    this.$bus.$on('login-success', this.checkLoginStatus)
  },
  beforeDestroy() {
    // 移除事件监听，防止内存泄漏
    this.$bus.$off('login-success', this.checkLoginStatus)
  },
  methods: {
    toPersonalCenter() {
      if (this.$route.path !== '/user') {
        this.$router.push('/user')
      }
    },
    // 检查登录状态
    checkLoginStatus() {
      const userStr = localStorage.getItem('user')
      console.log('网页头获取user字符串:', userStr)
      if (userStr) {
        this.user = JSON.parse(userStr)
        this.isLoggedIn = true
      } else {
        this.user = {}
        this.isLoggedIn = false
      }
    },

    // 退出登录
    handleLogout() {
      console.log('button press')
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除本地存储
        localStorage.removeItem('user')
        // 更新状态
        this.isLoggedIn = false
        this.user = {}
        // 跳转到登录页
        this.$router.push('/login')
        this.$message.success('退出登录成功')
      }).catch(() => { })
    }
  }
}
</script>

<style scoped>
/* 原有样式完全不变 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 8%;
  background: #fff;
  border-bottom: 1px solid #eee;
  position: relative;
  z-index: 9999;
  width: 100%;
  box-sizing: border-box;
}

.logo {
  font-size: 1.8rem;
  color: #409eff;
  font-weight: bold;
  flex-shrink: 0;
}

.nav {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.nav a {
  margin: 0 1.2rem;
  color: #333;
  text-decoration: none;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s ease;
}

.nav a.router-link-active {
  color: #409eff;
  font-weight: 500;
}

.nav a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #409eff;
}

/* 新增：用户头像下拉菜单样式（与原有导航完全一致） */
.user-nav-item {
  margin: 0 1.2rem;
}

.user-dropdown {
  display: flex;
  align-items: center;
  color: #333;
  cursor: pointer;
  text-decoration: none;
  padding: 0.5rem 0;
  transition: color 0.3s ease;
}

.user-dropdown:hover {
  color: #409eff;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 6px;
  border: 1px solid #eee;
}

.user-name {
  margin-right: 4px;
  font-size: 14px;
}

.el-dropdown-menu {
  margin-top: 8px;
}
</style>