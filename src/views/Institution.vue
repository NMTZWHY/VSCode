<template>
  <div class="institution-page">
    <div class="banner"></div>
    <div class="content">
      <!-- 行业标签筛选 -->
      <div class="tags">
        <el-button 
          v-for="(tag, index) in tagList" 
          :key="index"
          :type="activeTag === index ? 'primary' : ''"
          @click="switchTag(index)"
        >
          {{ tag }}
        </el-button>
      </div>

      <!-- 机构卡片列表 -->
      <div class="card-list">
        <div class="card-item" v-for="(item, index) in institutionList" :key="index">
          <div class="card-icon">{{ item.icon }}</div>
          <p class="card-name">{{ item.name }}</p>
          <p class="card-desc">{{ item.desc }}</p>
          <el-button type="primary" size="small" @click="goToDetail(item.id)">机构详情</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InstitutionPage',
  data() {
    return {
      // 当前选中的标签索引
      activeTag: 0,
      
      // 行业标签列表（可从后端动态获取）
      tagList: [
        '互联网', '农业', '零售', '旅游', 
        '建筑', '房地产', '餐饮'
      ],
      
      // 机构列表数据（可从后端动态获取）
      institutionList: [
        { id: 1, icon: '🏔️', name: 'XXXXX', desc: 'XXX类XX平台' },
        { id: 2, icon: '🏔️', name: 'XXXXX', desc: 'XXX类XX平台' },
        { id: 3, icon: '🏔️', name: 'XXXXX', desc: 'XXX类XX平台' },
        { id: 4, icon: '🏔️', name: 'XXXXX', desc: 'XXX类XX平台' },
        { id: 5, icon: '🏔️', name: 'XXXXX', desc: 'XXX类XX平台' },
        { id: 6, icon: '🏔️', name: 'XXXXX', desc: 'XXX类XX平台' },
        { id: 7, icon: '🏔️', name: 'XXXXX', desc: 'XXX类XX平台' },
        { id: 8, icon: '🏔️', name: 'XXXXX', desc: 'XXX类XX平台' }
      ]
    }
  },
  methods: {
    // 切换行业标签
    switchTag(index) {
      this.activeTag = index
      // 后续可在此处添加根据标签筛选机构的逻辑
      // this.filterInstitutionsByTag(this.tagList[index])
    },
    
    // 跳转到机构详情页
    goToDetail(id) {
      this.$router.push(`/institution/detail/${id}`)
    }
  }
}
</script>

<style scoped>
.banner {
  height: 200px;
  background: url('../Resource/InstitutionBng.png') center/cover no-repeat;
}

.content {
  padding: 2rem 8%;
}

.tags {
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap; /* 响应式：标签过多时自动换行 */
}

.card-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.card-item {
  border: 1px solid #eee;
  padding: 1.5rem 1rem;
  text-align: center;
  border-radius: 4px;
  transition: all 0.3s ease; /* 添加过渡动画 */
  background: #fff;
}

/* 添加卡片hover效果 */
.card-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  border-color: #409eff;
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 0.8rem;
}

.card-name {
  font-weight: bold;
  margin: 0.5rem 0;
  font-size: 1.05rem;
}

.card-desc {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1.2rem;
  line-height: 1.4;
}

/* 响应式适配 */
@media (max-width: 1200px) {
  .card-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .content {
    padding: 1.5rem 5%;
  }
  
  .card-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .card-list {
    grid-template-columns: 1fr;
  }
}
</style>