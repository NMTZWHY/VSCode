<template>
  <div class="overview-page">
    <div class="banner"></div>
    <div class="section">
      <h2 class="section-title">平台介绍</h2>
      <div class="icon-grid">
        <div class="icon-item" v-for="i in 10" :key="i">
          <div class="icon-circle">⭐</div>
          <p>XXXXXX</p>
        </div>
      </div>
    </div>
    <div class="section bg-gray">
      <h2 class="section-title">适用行业</h2>
      <div class="industry-grid">
        <div class="industry-item" v-for="item in industries" :key="item.name">
          <div class="industry-icon" :style="{backgroundImage: `url(${item.img})`}"></div>
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
    <div class="section">
      <h2 class="section-title">联系方式</h2>
      <div class="contact-grid">
        <div class="contact-item" v-for="i in 6" :key="i">
          <div class="contact-icon">📞</div>
          <p>XXXXXX</p>
          <p>XXXXXXXXXXXX</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OverviewPage',
  data() {
    return {
      // 适用行业数据（可从后端动态获取）
      industries: [
        { name: '医疗', img: 'https://picsum.photos/id/292/100/100' },
        { name: '矿业', img: 'https://picsum.photos/id/20/100/100' },
        { name: '水利', img: 'https://picsum.photos/id/237/100/100' },
        { name: '服务', img: 'https://picsum.photos/id/3/100/100' },
        { name: '保险', img: 'https://picsum.photos/id/24/100/100' },
        { name: '建筑', img: 'https://picsum.photos/id/1076/100/100' },
        { name: '化工', img: 'https://picsum.photos/id/1060/100/100' },
        { name: '广告', img: 'https://picsum.photos/id/1059/100/100' },
        { name: '农业', img: 'https://picsum.photos/id/1056/100/100' },
        { name: '零售', img: 'https://picsum.photos/id/292/100/100' }
      ]
    }
  }
}
</script>

<style scoped>
.banner {
  height: 200px;
  background: url('https://picsum.photos/id/1039/1920/300') center/cover no-repeat;
}
.section {
  padding: 3rem 8%;
}
.bg-gray {
  background: #f5f5f5;
}
.section-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.4rem;
  color: #303133;
}
.icon-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2rem;
}
.icon-item {
  text-align: center;
  transition: transform 0.3s ease;
}
.icon-item:hover {
  transform: translateY(-5px);
}
.icon-circle {
  width: 60px;
  height: 60px;
  line-height: 60px;
  border: 1px solid #409eff;
  border-radius: 50%;
  margin: 0 auto 0.5rem;
  color: #409eff;
  font-size: 1.5rem;
  transition: all 0.3s ease;
}
.icon-item:hover .icon-circle {
  background: #409eff;
  color: #fff;
}
.industry-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2rem;
}
.industry-item {
  text-align: center;
  transition: transform 0.3s ease;
}
.industry-item:hover {
  transform: translateY(-5px);
}
.industry-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 0.5rem;
  background-size: cover;
  background-position: center;
  transition: box-shadow 0.3s ease;
}
.industry-item:hover .industry-icon {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.contact-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
.contact-item {
  border: 1px solid #eee;
  padding: 1.5rem;
  text-align: center;
  border-radius: 4px;
  transition: all 0.3s ease;
  background: #fff;
}
.contact-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  border-color: #409eff;
}
.contact-icon {
  font-size: 1.8rem;
  color: #409eff;
  margin-bottom: 0.5rem;
}

/* 响应式适配 */
@media (max-width: 1200px) {
  .icon-grid, .industry-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 992px) {
  .icon-grid, .industry-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .contact-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .section {
    padding: 2rem 5%;
  }
  .icon-grid, .industry-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>