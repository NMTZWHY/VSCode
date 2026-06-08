<template>
  <div class="institution-page">
    <div class="banner"></div>
    <div class="content">
      <!-- 平台级别标签筛选（匹配申报字段） -->
      <div class="tags">
        <el-button v-for="(tag, index) in tagList" :key="index" :type="activeTag === index ? 'primary' : ''"
          @click="switchTag(index)">
          {{ tag }}
        </el-button>
      </div>

      <!-- 机构卡片列表（动态渲染申报数据） -->
      <div class="card-list">
        <div class="card-item" v-for="(item, index) in filteredList" :key="item.id">
          <!-- 根据平台级别显示不同图标 -->
          <div class="card-icon">{{ getLevelIcon(item.level) }}</div>
          <p class="card-name">{{ item.name_cn }}</p>
          <p class="card-type">{{ getCategoryText(item.category) }} | {{ getLevelText(item.level) }}</p>
          <p class="card-desc" v-html="item.position || '暂无平台定位'"></p>
          <el-button type="primary" size="small" @click="goToDetail(item.id)">机构详情</el-button>
        </div>
      </div>

      <!-- 空数据提示 -->
      <div v-if="filteredList.length === 0" class="empty-tip">
        <el-empty description="暂无申报的科研平台信息" />
      </div>
    </div>
  </div>
</template>

<script>
// 引入获取科研平台列表的接口（与申报页面同api文件）
import { getResearchPlatformList } from '@/api/research'

export default {
  name: 'InstitutionPage',
  data() {
    return {
      // 当前选中的标签索引
      activeTag: 0,

      // 平台级别标签（对应申报的level字段：1国家级 2省级 3市级）
      tagList: [
        '全部', '国家级', '省级', '市级'
      ],

      // 原始平台列表（从后端获取）
      platformList: [],
      // 筛选后的列表
      filteredList: []
    }
  },
  mounted() {
    // 页面加载时获取申报数据
    this.getPlatformData()
  },
  methods: {
    // 获取用户申报的科研平台列表
    async getPlatformData() {
      try {
        const res = await getResearchPlatformList()
        if (res.code === 200) {
          this.platformList = res.data || []
          this.filteredList = this.platformList
        }
      } catch (error) {
        this.$message.error('获取平台列表失败')
        console.error(error)
      }
    },

    // 切换标签筛选
    async switchTag(index) {
      this.activeTag = index
      // 标签映射：0=全部(不传参数) 1=国家级(1) 2=省级(2) 3=市级(3)
      let level = ''
      if (index === 1) level = '1'
      if (index === 2) level = '2'
      if (index === 3) level = '3'

      // 重新请求接口，后端筛选数据
      try {
        const res = await getResearchPlatformList(level)
        if (res.code === 200) {
          this.filteredList = res.data || []
        }
      } catch (err) {
        this.$message.error('数据加载失败')
      }
    },

    // 根据平台级别获取图标
    getLevelIcon(level) {
      const iconMap = {
        1: '🏅', // 国家级
        2: '🥈', // 省级
        3: '🥉'  // 市级
      }
      return iconMap[level] || '🏛️'
    },

    // 转换平台类别文字（对应申报的category字段）
    getCategoryText(category) {
      const categoryMap = {
        1: '重点实验室',
        3: '技术创新中心'
      }
      return categoryMap[category] || '其他平台'
    },

    // 转换平台级别文字
    getLevelText(level) {
      const levelMap = {
        1: '国家级',
        2: '省级',
        3: '市级'
      }
      return levelMap[level] || '未知级别'
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
  flex-wrap: wrap;
  /* 响应式：标签过多时自动换行 */
}

.card-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  /* 关键：让所有卡片高度统一 */
  grid-auto-rows: 1fr;
}

.card-item {
  border: 1px solid #eee;
  padding: 1.5rem 1rem;
  text-align: center;
  border-radius: 4px;
  transition: all 0.3s ease;
  background: #fff;
  /* 关键：统一卡片内部布局 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* 统一卡片最小高度，根据内容调整 */
  min-height: 320px;
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

/* 新增：平台类型样式 */
.card-type {
  font-size: 0.85rem;
  color: #409eff;
  margin: 0.3rem 0;
}

.card-desc {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1.2rem;
  line-height: 1.4;
  /* 超出两行显示省略号 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  /* 关键：让描述部分占满剩余空间 */
  flex: 1;
}

/* 空数据样式 */
.empty-tip {
  padding: 4rem 0;
  text-align: center;
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

::v-deep .card-desc img {
  /* 最大宽度不超过卡片宽度的60% */
  max-width: 60% !important;
  /* 最大高度限制为120px，防止过高 */
  max-height: 120px !important;
  /* 高度自动，保持原始宽高比 */
  height: auto !important;
  /* 图片居中显示 */
  display: block;
  margin: 8px auto !important;
  /* 保持和编辑/详情页一致的风格 */
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
</style>