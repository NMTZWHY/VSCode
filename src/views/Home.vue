<template>
  <div class="home-page">
    <!-- 1. 顶部轮播Banner -->
    <section class="banner">
      <div class="banner-content">
        <h1>机构管理服务</h1>
        <p>10年服务经验积累，9种安全保障，8种服务场景，<br>优质服务值得您信赖</p>
        <el-button type="primary" plain style="margin-left: 3rem;" @click="$router.push('/overview')">了解更多</el-button>
      </div>
      <div class="banner-indicator">
        <span class="active"></span>
        <span></span>
      </div>
    </section>

    <!-- 2. 服务介绍模块 -->
    <section class="service-section">
      <div class="service-item">
        <div class="service-text">
          <h3>XXXXXXXX</h3>
          <p>xxxxxxxx,xxxxxxxx</p>
          <p>XXXXXXXXXXXXXXXXXXXX</p>
          <p>XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
          <p>XXXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
          <el-button type="primary" plain size="small">了解更多</el-button>
        </div>
        <div class="service-img">
          <img src="https://picsum.photos/id/60/600/400" alt="服务图片">
        </div>
      </div>

      <div class="service-item reverse">
        <div class="service-text">
          <h3>XXXXXXXX</h3>
          <p>xxxxxxxx,xxxxxxxx</p>
          <p>XXXXXXXXXXXXXXXXXXXX</p>
          <p>XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
          <p>XXXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
          <el-button type="primary" plain size="small">了解更多</el-button>
        </div>
        <div class="service-img">
          <img src="https://picsum.photos/id/3/600/400" alt="服务图片">
        </div>
      </div>

      <div class="service-item">
        <div class="service-text">
          <h3>XXXXXXXX</h3>
          <p>xxxxxxxx,xxxxxxxx</p>
          <p>XXXXXXXXXXXXXXXXXXXX</p>
          <p>XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
          <p>XXXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
          <el-button type="primary" plain size="small">了解更多</el-button>
        </div>
        <div class="service-img">
          <img src="https://picsum.photos/id/1002/600/400" alt="服务图片">
        </div>
      </div>

      <div class="service-item reverse">
        <div class="service-text">
          <h3>XXXXXXXX</h3>
          <p>xxxxxxxx,xxxxxxxx</p>
          <p>XXXXXXXXXXXXXXXXXXXX</p>
          <p>XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
          <p>XXXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
          <el-button type="primary" plain size="small">了解更多</el-button>
        </div>
        <div class="service-img">
          <img src="https://picsum.photos/id/28/600/400" alt="服务图片">
        </div>
      </div>
    </section>

    <!-- 3. 适用行业模块 -->
    <section class="industry-section">
      <h2>这些行业都可以用我们</h2>
      <div class="industry-grid">
        <img src="https://picsum.photos/id/1031/400/200" alt="行业1">
        <img src="https://picsum.photos/id/292/400/200" alt="行业2">
        <img src="https://picsum.photos/id/3/400/200" alt="行业3">
        <img src="https://picsum.photos/id/1076/400/200" alt="行业4">
        <img src="https://picsum.photos/id/1059/400/200" alt="行业5">
        <img src="https://picsum.photos/id/425/400/200" alt="行业6">
      </div>
      <el-button type="primary" plain>了解更多行业</el-button>
    </section>

    <!-- 4. 合作机构模块 -->
    <section class="partner-section">
      <h2>他们都在使用我们</h2>
      <div class="partner-grid">
        <div class="partner-logo" v-for="i in 8" :key="i">
          <img src="https://picsum.photos/id/10/100/100" alt="logo">
        </div>
      </div>
    </section>

    <!-- 5. 底部CTA模块 -->
    <section class="cta-section">
      <h2>安全稳定企业服务</h2>
      <p>10年服务经验积累，9种安全保障，8种服务场景，优质服务值得您信赖</p>
      <el-button type="primary">了解更多</el-button>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      // 如需添加轮播功能，可在此处定义响应式数据
      // currentBanner: 0
    }
  },
  methods: {
    // 如需添加轮播切换功能，可在此处定义方法
    // changeBanner(index) {
    //   this.currentBanner = index
    // }
  }
}
</script>

<style scoped>
/* 全局基础样式 */
.home-page {
  width: 100%;
}

/* 1. Banner模块 */
.banner {
  height: 500px;
  background: url('../Resource/HomeBng.png') center/cover no-repeat;
  position: relative;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 10%;
}
.banner-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  margin-left: 3rem;
}
.banner-content p {
  line-height: 1.8;
  margin-bottom: 1.5rem;
  margin-left: 3rem;
}
.banner-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.8rem;
}
.banner-indicator span {
  width: 20px;
  height: 3px;
  background: rgba(255,255,255,0.5);
  cursor: pointer; /* 添加鼠标指针样式 */
  transition: background 0.3s;
}
.banner-indicator span.active {
  background: #fff;
}

/* 2. 服务介绍模块 */
.service-section {
  padding: 4rem 10%;
}
.service-item {
  display: flex;
  align-items: center;
  gap: 3rem;
  margin-bottom: 4rem;
}
.service-item.reverse {
  flex-direction: row-reverse;
}
.service-text {
  flex: 1;
}
.service-text h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}
.service-text p {
  color: #666;
  margin: 0.5rem 0;
  font-size: 0.95rem;
}
.service-img {
  flex: 1;
}
.service-img img {
  width: 100%;
  border-radius: 4px;
  transition: transform 0.3s; /* 添加图片hover效果 */
}
.service-img img:hover {
  transform: scale(1.02);
}

/* 3. 适用行业模块 */
.industry-section {
  padding: 4rem 10%;
  background: #f5f5f5;
  text-align: center;
}
.industry-section h2 {
  margin-bottom: 2rem;
  font-size: 1.3rem;
}
.industry-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}
.industry-grid img {
  width: 100%;
  border-radius: 4px;
  transition: all 0.3s; /* 添加图片hover效果 */
}
.industry-grid img:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

/* 4. 合作机构模块 */
.partner-section {
  padding: 4rem 10%;
  text-align: center;
}
.partner-section h2 {
  margin-bottom: 2rem;
  font-size: 1.3rem;
}
.partner-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}
.partner-logo {
  border: 1px solid #eee;
  padding: 1rem;
  background: #fff;
  transition: all 0.3s; /* 添加logo hover效果 */
}
.partner-logo:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
}
.partner-logo img {
  width: 100%;
  filter: grayscale(100%); /* 默认灰度显示 */
  transition: filter 0.3s;
}
.partner-logo:hover img {
  filter: grayscale(0); /* hover时恢复彩色 */
}

/* 5. 底部CTA模块 */
.cta-section {
  background: #333;
  color: #fff;
  padding: 4rem 10%;
  text-align: center;
}
.cta-section h2 {
  margin-bottom: 1rem;
}
.cta-section p {
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  opacity: 0.9;
}
</style>