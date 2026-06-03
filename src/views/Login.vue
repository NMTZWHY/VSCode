<template>
  <div class="login-page">
    <div class="bg-image"></div>
    <div class="login-form">
      <!-- 登录/注册切换标签 -->
      <el-tabs v-model="activeTab" type="card" class="login-tabs">
        <!-- 登录面板（完全不变） -->
        <el-tab-pane label="登录" name="login">
          <el-input placeholder="请输入用户名" v-model="loginForm.username" class="input-item" clearable></el-input>
          <el-input placeholder="请输入密码" v-model="loginForm.password" type="password" class="input-item" clearable
            @keyup.enter.native="handleLogin"></el-input>
          <el-button type="primary" size="large" class="login-btn" @click="handleLogin" :loading="loginLoading">
            登录
          </el-button>
        </el-tab-pane>

        <!-- 注册面板 -->
        <el-tab-pane label="注册" name="register">
          <el-input placeholder="请输入用户名" v-model="registerForm.username" class="input-item" clearable></el-input>
          <el-input placeholder="请输入邮箱（可选）" v-model="registerForm.email" type="email" class="input-item"
            clearable></el-input>
          <el-input placeholder="请输入密码" v-model="registerForm.password" type="password" class="input-item"
            clearable></el-input>
          <el-input placeholder="请确认密码" v-model="registerForm.confirmPassword" type="password" class="input-item"
            clearable></el-input>

          <el-input placeholder="请输入真实姓名（可选）" v-model="registerForm.real_name" class="input-item" clearable></el-input>
          <el-input placeholder="请输入昵称（可选）" v-model="registerForm.nickname" class="input-item" clearable></el-input>
          <el-input placeholder="请输入联系电话（可选）" v-model="registerForm.phone" class="input-item" clearable></el-input>
          <el-input placeholder="请输入单位名称（可选）" v-model="registerForm.company" class="input-item" clearable></el-input>

          <!-- 头像上传：删除action、on-success，改用自定义上传 -->
          <div class="avatar-upload-container">
            <span class="avatar-label">头像（可选）</span>
            <el-upload action="" class="avatar-uploader" :show-file-list="false" :http-request="uploadAvatar"
              :before-upload="beforeAvatarUpload">
              <img v-if="registerForm.avatar" :src="registerForm.avatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>

          <el-button type="primary" size="large" class="login-btn" @click="handleRegister" :loading="registerLoading"
            @keyup.enter.native="handleRegister">
            注册
          </el-button>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      activeTab: 'login',
      loginForm: {
        username: '',
        password: ''
      },
      loginLoading: false,
      registerForm: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        real_name: '',
        nickname: '',
        phone: '',
        company: '',
        avatar: ''
      },
      registerLoading: false
    }
  },
  methods: {
    // 登录方法不变
    async handleLogin() {
      // console.log("===== 登录按钮被点击了 =====")
      // console.log("表单数据：", this.loginForm)
      if (!this.loginForm.username.trim()) {
        console.log('message执行')
        this.$message.warning('请输入用户名')
        return
      }
      if (!this.loginForm.password.trim()) {
        this.$message.warning('请输入密码')
        return
      }

      // console.log("===== 表单验证通过，准备发请求 =====")

      this.loginLoading = true
      try {
        const res = await this.$axios.post('/login/', this.loginForm)
        // console.log('登录接口返回：', res)

        // 关键：正确提取用户信息（如果登录接口也是嵌套格式）
        // 如果登录接口直接返回{user: {...}}，则不需要这一步
        // 请根据控制台打印的登录返回结果调整
        const user = res.user 

        localStorage.setItem('user', JSON.stringify(user))
        this.$message.success('登录成功')
        this.$bus.$emit('login-success')
        this.$router.push('/')
      } catch (err) {
        // this.$message.error('用户名或密码错误')
        console.log("===== 请求出错 =====", err)
      } finally {
        this.loginLoading = false
      }
    },

    // 注册方法不变
    async handleRegister() {
      if (!this.registerForm.username.trim()) {
        this.$message.warning('请输入用户名')
        return
      }
      if (!this.registerForm.password.trim()) {
        this.$message.warning('请输入密码')
        return
      }
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        this.$message.warning('两次输入的密码不一致')
        return
      }
      if (this.registerForm.password.length < 6) {
        this.$message.warning('密码长度不能少于6位')
        return
      }

      this.registerLoading = true
      try {
        await this.$axios.post('/register/', this.registerForm)
        console.log('前端发送用户信息：'+ this.registerForm.avatar)
        this.$message.success('注册成功，请登录')
        this.activeTab = 'login'
        this.registerForm = {
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          real_name: '',
          nickname: '',
          phone: '',
          company: '',
          avatar: ''
        }
      } catch (err) {
        this.$message.error(err.response?.data?.msg || '注册失败')
      } finally {
        this.registerLoading = false
      }
    },

    // 上传前文件校验 保留不变
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('只能上传 JPG/PNG 格式的图片')
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB')
      }
      return isJPG && isLt2M
    },

    // 自定义axios上传头像 核心新增方法
    // 自定义axios上传头像 修复版
    async uploadAvatar(params) {
      const file = params.file
      const formData = new FormData()
      formData.append('file', file)
      try {
        const res = await this.$axios.post('/upload/avatar/', formData)
        console.log('头像上传后端返回：', res.data)

        // 关键修复：正确提取嵌套的url字段
        // 后端返回格式：{msg: '上传成功', data: {url: "/media/avatars/xxx.jpg"}}
        let imgUrl = res.data.url

        // 智能判断：如果返回的已经是完整URL，直接使用；否则拼接域名
        if (!imgUrl.startsWith('http')) {
          imgUrl = 'http://localhost:8000' + imgUrl
        }

        this.registerForm.avatar = imgUrl
        this.$message.success('头像上传成功')
        console.log('最终头像URL：', this.registerForm.avatar)
      } catch (error) {
        console.error('头像上传失败：', error)
        this.$message.error('头像上传失败')
      }
    }
  }
}
</script>

<style scoped>
/* 所有样式完全原样保留，无修改 */
.login-page {
  position: relative;
  height: calc(100vh - 120px);
}

.bg-image {
  width: 100%;
  height: 100%;
  background: url('../Resource/LoginBng.png') center/cover no-repeat;
}

.login-form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  padding: 0;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0.1);
  overflow: hidden;
}

.login-tabs {
  margin: 0;
}

.login-tabs ::v-deep .el-tabs__content {
  padding: 2rem;
}

.login-tabs ::v-deep .el-tabs__nav-wrap {
  margin: 0;
}

.login-tabs ::v-deep .el-tabs__item {
  width: 50%;
  text-align: center;
}

.input-item {
  width: 100%;
  margin-bottom: 1rem;
}

.login-btn {
  width: 100%;
  margin-top: 0.5rem;
}

.avatar-upload-container {
  margin-bottom: 1rem;
  text-align: center;
}

.avatar-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #606266;
  font-size: 14px;
}

.avatar-uploader {
  display: inline-block;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  transition: border-color 0.3s;
}

.avatar-uploader-icon:hover {
  border-color: #409eff;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: block;
  object-fit: cover;
}
</style>