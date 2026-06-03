<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-col">
        <h4>XXXXXXXXXXXX单位名称</h4>
        <p>地址: xxxxxxxxxxxx</p>
        <p>电话: 010-00000000</p>
        <p>邮箱: xxxxxxx.com</p>
        <div class="social">
          <span class="icon">🌐</span>
          <span class="icon">💬</span>
        </div>
        <p class="link">友情链接: xxxxxxxxxx</p>
      </div>
      <div class="footer-col">
        <h4>平台介绍</h4>
        <p>平台概况</p>
        <p>团队介绍</p>
        <p>关于我们</p>
      </div>
      <div class="footer-col">
        <h4>平台服务</h4>
        <p>申请入驻</p>
        <p>新闻动态</p>
        <p>用户登录</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #333;
  color: #fff;
  padding: 3rem 8%;
  margin-top: auto;
}
.footer-content {
  display: flex;
  justify-content: space-between;
}
.footer-col {
  line-height: 1.8;
}
.footer-col h4 {
  margin-bottom: 1rem;
}
.icon {
  display: inline-block;
  width: 36px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  border: 1px solid #fff;
  border-radius: 50%;
  margin-right: 0.5rem;
}
.link {
  margin-top: 1rem;
  font-size: 0.9rem;
}
</style>