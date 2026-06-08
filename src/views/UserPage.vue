<template>
  <div class="user-page">
    <!-- 用户信息卡片 -->
    <div class="user-info-card">
      <div class="avatar-wrapper">
        <img :src="userInfo.avatar || 'https://cube.elemecdn.com/01/50/c73135d2786873e773122e8421e8epng.png'" alt="用户头像"
          class="user-avatar">
      </div>
      <div class="user-base">
        <h3>{{ userInfo.username || '未知用户' }}</h3>
        <p>昵称：{{ userInfo.nickname || '未设置' }}</p>
        <p>真实姓名：{{ userInfo.real_name || '未设置' }}</p>
        <p>
          <el-tag v-if="isNormal" type="info">普通用户</el-tag>
          <el-tag v-if="isAuditAdmin && !isSuperAdmin" type="warning">审批管理员</el-tag>
          <el-tag v-if="isSuperAdmin" type="danger">超级管理员</el-tag>
        </p>
      </div>

      <el-button type="primary" icon="el-icon-user" @click="openEditDialog">
        修改个人信息
      </el-button>
      <el-button type="danger" icon="el-icon-switch-button" @click="handleLogout">
        退出登录
      </el-button>
    </div>

    <!-- 【所有用户可用】我的申报进度 -->
    <div class="apply-card">
      <div class="card-header">
        <h2>我的申报进度</h2>
        <el-button type="primary" icon="el-icon-plus" @click="$router.push('/apply')">新增申报</el-button>
      </div>
      <el-table :data="applyList" border style="width:100%" stripe>
        <el-table-column label="申报编号" prop="id" align="center" />
        <el-table-column label="申报标题" prop="name_cn" align="center" />
        <el-table-column label="申请单位" prop="depend_unit" align="center" />
        <el-table-column label="提交时间" prop="created_at" align="center" />
        <el-table-column label="当前状态" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === 'pending' ? 'warning' : scope.row.status === 'approved' ? 'success' : 'danger'">
              {{ scope.row.status === 'pending' ? '待审核' : scope.row.status === 'approved' ? '已通过' : '已驳回' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="viewDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="applyList.length === 0" class="empty-tip">暂无申报记录，点击右上角新增申报</div>
    </div>

    <!-- 【审批管理员+超级管理员可见】待审批列表 -->
    <div class="apply-card" v-if="isAuditAdmin">
      <div class="card-header">
        <h2>待审批列表</h2>
        <el-tag type="warning">待审核：{{ pendingList.length }}条</el-tag>
      </div>
      <el-table :data="pendingList" border stripe>
        <el-table-column label="申请类型" align="center">
          <template slot-scope="scope">
            <el-tag type="primary">入驻申请</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="申请人账号" prop="username" align="center" />
        <el-table-column label="依托单位" prop="depend_unit" align="center" />
        <el-table-column label="提交时间" prop="created_at" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="passApply(scope.row)">通过</el-button>
            <el-button size="mini" type="danger" @click="rejectApply(scope.row)">驳回</el-button>
            <el-button type="text" @click="viewDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="pendingList.length === 0" class="empty-tip">暂无待审批数据</div>
    </div>

    <!-- 【审批管理员+超级管理员可见】审批历史记录 -->
    <div class="apply-card" v-if="isAuditAdmin">
      <div class="card-header">
        <h2>审批历史记录</h2>
      </div>
      <el-table :data="auditRecordList" border stripe>
        <el-table-column label="申请类型" align="center">
          <template slot-scope="scope">
            <el-tag type="primary">入驻申请</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="申请人" prop="username" align="center" />
        <el-table-column label="申请单位" prop="depend_unit" align="center" />
        <el-table-column label="审批结果" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.result === 'approved' ? 'success' : 'danger'">
              {{ scope.row.result === 'approved' ? '已通过' : '已驳回' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="驳回备注" prop="reject_reason" align="center" />
        <el-table-column label="审批时间" prop="audit_time" align="center" />
        <el-table-column label="查看" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="viewDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="auditRecordList.length === 0" class="empty-tip">暂无审批历史</div>
    </div>

    <!-- 修改信息弹窗 -->
    <el-dialog title="修改个人信息" :visible.sync="editVisible" width="500px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="头像">
          <el-upload action="" :show-file-list="false" :http-request="uploadAvatar" :before-upload="beforeAvatarUpload">
            <img v-if="editForm.avatar" :src="editForm.avatar" class="avatar-small">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="editForm.nickname" clearable></el-input>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="editForm.real_name" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="editForm.phone" clearable></el-input>
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="editForm.company" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align:right">
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUserInfo">保存修改</el-button>
      </div>
    </el-dialog>

    <!-- 详情弹窗（完整七大阶段展示） -->
    <el-dialog title="申请详情" :visible.sync="detailVisible" width="900px" top="12vh">
      <div v-if="currentDetail" class="detail-container">
        <!-- 基础信息头部 -->
        <div class="detail-head">
          <p><b>申报编号：</b>{{ currentDetail.id || '-' }}</p>
          <p><b>提交时间：</b>{{ currentDetail.created_at || '-' }}</p>
          <p>
            <b>当前状态：</b>
            <el-tag
              :type="currentDetail.status === 'pending' ? 'warning' : currentDetail.status === 'approved' ? 'success' : 'danger'">
              {{ currentDetail.status === 'pending' ? '待审核' : currentDetail.status === 'approved' ? '已通过' : '已驳回' }}
            </el-tag>
          </p>
          <p v-if="currentDetail.audit_time"><b>审核时间：</b>{{ currentDetail.audit_time }}</p>
          <p v-if="currentDetail.reject_reason"><b>驳回原因：</b>{{ currentDetail.reject_reason }}</p>
        </div>

        <!-- 第一阶段：基本概况 -->
        <div class="detail-block">
          <h3 class="block-title">一、基本概况</h3>
          <div class="block-content">
            <p><b>平台名称(中文)：</b>{{ currentDetail.name_cn || '未填写' }}</p>
            <p><b>平台名称(英文)：</b>{{ currentDetail.name_en || '未填写' }}</p>
            <p>
              <b>平台类别：</b>
              <span v-if="currentDetail.category === '1'">重点实验室</span>
              <span v-else-if="currentDetail.category === '3'">技术创新中心</span>
              <span v-else>未填写</span>
            </p>
            <p>
              <b>平台级别：</b>
              <span v-if="currentDetail.level === '1'">国家级</span>
              <span v-else-if="currentDetail.level === '2'">省级</span>
              <span v-else-if="currentDetail.level === '3'">市级</span>
              <span v-else>未填写</span>
            </p>
            <p><b>主管部门：</b>{{ currentDetail.department || '未填写' }}</p>
            <p><b>依托单位：</b>{{ currentDetail.depend_unit || '未填写' }}</p>
            <p><b>共建单位：</b>{{ currentDetail.together_unit || '未填写' }}</p>
            <p><b>合作单位：</b>{{ currentDetail.cooperate_unit || '未填写' }}</p>
            <p><b>批准设立时间：</b>{{ currentDetail.approve_time || '未填写' }}</p>
            <p><b>批准文号：</b>{{ currentDetail.approve_no || '未填写' }}</p>
            <p><b>建设期：</b>{{ currentDetail.valid_period || '未填写' }}</p>
            <p>
              <b>验收状态：</b>
              <span v-if="currentDetail.accept_status === '0'">未验收</span>
              <span v-else-if="currentDetail.accept_status === '1'">已验收</span>
              <span v-else>未填写</span>
            </p>
            <p><b>平台定位：</b></p>
            <div class="rich-text-box" v-html="currentDetail.position || '未填写'"></div>
            <p><b>总体目标：</b></p>
            <div class="rich-text-box" v-html="currentDetail.target || '未填写'"></div>
            <p><b>主要研究方向：</b></p>
            <div class="rich-text-box" v-html="currentDetail.direction || '未填写'"></div>
          </div>
        </div>

        <!-- 第二阶段：组织结构 -->
        <div class="detail-block">
          <h3 class="block-title">二、组织结构</h3>
          <div class="block-content">
            <p><b>平台负责人：</b>{{ currentDetail.leader || '未填写' }}</p>
            <p><b>行政负责人：</b>{{ currentDetail.admin_leader || '未填写' }}</p>
            <p><b>技术负责人：</b>{{ currentDetail.tech_leader || '未填写' }}</p>
            <p><b>平台联系人：</b>{{ currentDetail.contact_name || '未填写' }}</p>
            <p><b>联系电话：</b>{{ currentDetail.contact_phone || '未填写' }}</p>

            <p><b>管理机构设置：</b></p>
            <div class="rich-text-box">{{ currentDetail.organization_structure || '未填写' }}</div>

            <p><b>内部管理制度：</b></p>
            <div class="rich-text-box" v-html="currentDetail.inner_rule || '未填写'"></div>

            <p><b>学术/技术委员会组成：</b></p>
            <div class="rich-text-box">{{ currentDetail.academic_committee_structure || '未填写' }}</div>

            <p><b>学术/技术委员会职责：</b></p>
            <div class="rich-text-box" v-html="currentDetail.academic_committee_duty || '未填写'"></div>
          </div>
        </div>

        <!-- 第三阶段：科研队伍 -->
        <div class="detail-block">
          <h3 class="block-title">三、科研队伍</h3>
          <div class="block-content">
            <p><b>固定人员总数：</b>{{ currentDetail.fixed_person_total ? currentDetail.fixed_person_total : 0 }} 人</p>
            <p><b>核心骨干人数：</b>{{ currentDetail.core_person_num ? currentDetail.core_person_num : 0 }} 人</p>

            <p><b>人员职称结构：</b></p>
            <div class="rich-text-box" v-html="currentDetail.title_structure || '未填写'"></div>

            <p><b>人员学历结构：</b></p>
            <div class="rich-text-box" v-html="currentDetail.education_structure || '未填写'"></div>

            <p><b>人员年龄结构：</b></p>
            <div class="rich-text-box" v-html="currentDetail.age_structure || '未填写'"></div>

            <p><b>学术带头人信息：</b></p>
            <div class="rich-text-box" v-html="currentDetail.academic_leader || '未填写'"></div>

            <p><b>高层次人才情况：</b></p>
            <div class="rich-text-box" v-html="currentDetail.high_level_talent || '未填写'"></div>

            <p><b>流动人员情况：</b></p>
            <div class="rich-text-box" v-html="currentDetail.flowing_personnel || '未填写'"></div>

            <p><b>人才培养机制：</b></p>
            <div class="rich-text-box" v-html="currentDetail.talent_training || '未填写'"></div>
          </div>
        </div>

        <!-- 第四阶段：科研条件 -->
        <div class="detail-block">
          <h3 class="block-title">四、科研条件</h3>
          <div class="block-content">
            <p><b>科研用房面积：</b>{{ currentDetail.room_area || '未填写' }}</p>
            <p><b>实验室数量：</b>{{ currentDetail.lab_num ? currentDetail.lab_num : 0 }} 间</p>
            <p><b>仪器设备总台套数：</b>{{ currentDetail.equipment_total ? currentDetail.equipment_total : 0 }} 套</p>
            <p><b>仪器设备总原值：</b>{{ currentDetail.equipment_value || '未填写' }}</p>

            <p><b>中试基地情况：</b></p>
            <div class="rich-text-box" v-html="currentDetail.pilot_base_situation || '未填写'"></div>

            <p><b>主要大型仪器设备：</b></p>
            <div class="rich-text-box" v-html="currentDetail.main_large_equipment || '未填写'"></div>

            <p><b>资源库/数据库情况：</b></p>
            <div class="rich-text-box" v-html="currentDetail.resource_database_situation || '未填写'"></div>
          </div>
        </div>

        <!-- 第五阶段：科研成果 -->
        <div class="detail-block">
          <h3 class="block-title">五、科研成果</h3>
          <div class="block-content">
            <p><b>年度承担国家级项目数：</b>{{ currentDetail.national_project_num ? currentDetail.national_project_num : 0 }} 项</p>
            <p><b>年度承担省部级项目数：</b>{{ currentDetail.provincial_project_num ? currentDetail.provincial_project_num : 0 }} 项
            </p>
            <p><b>年度发表SCI/EI论文数：</b>{{ currentDetail.sci_ei_paper_num ? currentDetail.sci_ei_paper_num : 0 }} 篇</p>
            <p><b>年度出版专著数：</b>{{ currentDetail.monograph_num ? currentDetail.monograph_num : 0 }} 部</p>
            <p><b>年度授权发明专利数：</b>{{ currentDetail.invention_patent_num ? currentDetail.invention_patent_num : 0 }} 项</p>
            <p><b>年度授权实用新型专利数：</b>{{ currentDetail.utility_model_patent_num ? currentDetail.utility_model_patent_num : 0
            }}
              项</p>
            <p><b>年度获得科技奖励数：</b>{{ currentDetail.science_award_num ? currentDetail.science_award_num : 0 }} 项</p>

            <p><b>奖励级别及名称：</b></p>
            <div class="rich-text-box" v-html="currentDetail.award_level_and_name || '未填写'"></div>

            <p><b>成果转化项目数：</b>{{ currentDetail.achievement_transformation_num ?
              currentDetail.achievement_transformation_num
              : 0 }} 项</p>
            <p><b>技术服务收入：</b>{{ currentDetail.technical_service_income || '未填写' }}</p>
          </div>
        </div>

        <!-- 第六阶段：开放共享 -->
        <div class="detail-block">
          <h3 class="block-title">六、开放共享</h3>
          <div class="block-content">
            <p><b>对外开放机制：</b></p>
            <div class="rich-text-box" v-html="currentDetail.open_rule || '未填写'"></div>

            <p><b>主要服务对象：</b>{{ currentDetail.service_target || '未填写' }}</p>
            <p><b>年度服务企业数：</b>{{ currentDetail.service_company_num ? currentDetail.service_company_num : 0 }} 家</p>

            <p><b>共享服务流程：</b></p>
            <div class="rich-text-box" v-html="currentDetail.shared_service_process || '未填写'"></div>

            <p><b>预约方式：</b></p>
            <div class="rich-text-box" v-html="currentDetail.reservation_method || '未填写'"></div>

            <p><b>收费标准：</b></p>
            <div class="rich-text-box" v-html="currentDetail.charging_standard || '未填写'"></div>

            <p><b>年度服务收入总额：</b>{{ currentDetail.annual_service_income || '未填写' }}</p>
            <p><b>产学研合作项目数：</b>{{ currentDetail.industry_university_research_project_num ?
              currentDetail.industry_university_research_project_num : 0 }} 项</p>
            <p><b>科普与培训活动次数：</b>{{ currentDetail.popular_science_training_activity_num ?
              currentDetail.popular_science_training_activity_num : 0 }} 次</p>
          </div>
        </div>

        <!-- 第七阶段：运行管理 -->
        <div class="detail-block">
          <h3 class="block-title">七、运行管理</h3>
          <div class="block-content">
            <p><b>年度经费总额：</b>{{ currentDetail.year_fund_total || '未填写' }}</p>

            <p><b>资产管理情况：</b></p>
            <div class="rich-text-box" v-html="currentDetail.asset_manage || '未填写'"></div>

            <p><b>安全管理制度：</b></p>
            <div class="rich-text-box" v-html="currentDetail.safe_rule || '未填写'"></div>

            <p><b>中长期发展规划：</b></p>
            <div class="rich-text-box" v-html="currentDetail.long_term_plan || '未填写'"></div>

            <p><b>经费来源结构：</b></p>
            <div class="rich-text-box" v-html="currentDetail.funding_source_structure || '未填写'"></div>

            <p><b>年度工作计划：</b></p>
            <div class="rich-text-box" v-html="currentDetail.annual_work_plan || '未填写'"></div>

            <p><b>存在主要问题：</b></p>
            <div class="rich-text-box" v-html="currentDetail.main_problems || '未填写'"></div>

            <p><b>改进措施：</b></p>
            <div class="rich-text-box" v-html="currentDetail.improvement_measures || '未填写'"></div>

            <p><b>年度工作总结：</b></p>
            <div class="rich-text-box" v-html="currentDetail.annual_work_summary || '未填写'"></div>

            <p><b>运行绩效考核结果：</b></p>
            <div class="rich-text-box" v-html="currentDetail.performance_evaluation_result || '未填写'"></div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "UserPage",
  data() {
    return {
      userInfo: {},
      isNormal: false,
      isAuditAdmin: false,
      isSuperAdmin: false,
      editVisible: false,
      editForm: {},
      detailVisible: false,
      currentDetail: null,
      applyList: [],
      pendingList: [],
      auditRecordList: []
    }
  },
  created() {
    this.getUserInfo()
  },
  watch: {
    userInfo(val) {
      if (val && val.username) {
        this.getMyApply()
        if (this.isAuditAdmin) {
          this.getPendingApply()
          this.getAuditRecord()
        }
      }
    }
  },
  methods: {
    getUserInfo() {
      const user = localStorage.getItem("user")
      if (user) {
        this.userInfo = JSON.parse(user)
        const role = this.userInfo.role ?? 0
        this.isNormal = role === 0
        this.isAuditAdmin = role === 1 || role === 2
        this.isSuperAdmin = role === 2
      }
    },

    async getMyApply() {
      try {
        const res = await this.$axios.get("/my/apply/")
        this.applyList = Array.isArray(res) ? res : []
      } catch (e) {
        this.$message.error("获取我的申报失败")
      }
    },

    async getPendingApply() {
      try {
        const res = await this.$axios.get("/pending/apply/")
        this.pendingList = res || []
      } catch (e) {
        this.$message.error("获取待审批列表失败")
      }
    },

    async getAuditRecord() {
      try {
        const res = await this.$axios.get("/audit/record/")
        this.auditRecordList = res || []
      } catch (e) {
        this.$message.error("获取审批历史失败")
      }
    },

    openEditDialog() {
      this.editForm = { ...this.userInfo }
      this.editVisible = true
    },

    async saveUserInfo() {
      try {
        const res = await this.$axios.post("/user/update/", this.editForm)
        this.userInfo = { ...this.editForm }
        localStorage.setItem("user", JSON.stringify(this.userInfo))
        this.$message.success("修改成功")
        this.editVisible = false
        this.$bus.$emit("login-success")
      } catch (e) {
        this.$message.error(e.response?.data?.msg || "修改失败")
      }
    },

    async uploadAvatar(params) {
      const file = params.file
      const fd = new FormData()
      fd.append("file", file)
      const user = JSON.parse(localStorage.getItem("user"))
      fd.append("old_avatar", user.avatar || "")
      try {
        const res = await this.$axios.post("/upload/avatar/", fd)
        let url = res.data.url
        if (!url.startsWith("http")) url = "http://localhost:8000" + url
        this.editForm.avatar = url
        this.$message.success("头像上传成功")
      } catch (err) {
        this.$message.error("上传失败")
      }
    },

    beforeAvatarUpload(file) {
      const isImg = file.type.includes("image")
      const sizeOk = file.size < 1024 * 1024
      if (!isImg) this.$message.error("仅支持图片")
      if (!sizeOk) this.$message.error("图片不能大于1MB")
      return isImg && sizeOk
    },

    viewDetail(row) {
      // 先清空，再弹窗，再请求详情
      this.currentDetail = null
      this.detailVisible = true
      this.$axios.get(`/apply/detail/?id=${row.id}`).then(res => {
        const data = res

        // ---------- 1. 人员职称结构 ----------
        if (data.title_structure) {
          try {
            const arr = JSON.parse(data.title_structure)
            data.title_structure = arr.map(item => `${item.title}：${item.count}人`).join("， ")
          } catch (e) { }
        }

        // ---------- 2. 人员学历结构 ----------
        if (data.education_structure) {
          try {
            const arr = JSON.parse(data.education_structure)
            data.education_structure = arr.map(item => `${item.education}：${item.count}人`).join("， ")
          } catch (e) { }
        }

        // ---------- 3. 人员年龄结构 ----------
        if (data.age_structure) {
          try {
            const arr = JSON.parse(data.age_structure)
            data.age_structure = arr.map(item => `${item.ageRange}：${item.count}人`).join("， ")
          } catch (e) { }
        }

        // ---------- 4. 学术带头人信息 ----------
        if (data.academic_leader) {
          try {
            const arr = JSON.parse(data.academic_leader)
            data.academic_leader = arr.map(item => {
              return `姓名：${item.name}，性别：${item.gender || '无'}，年龄：${item.age || 0}，职称：${item.title || '无'}，其他：${item.other || '无'}`
            }).join("\n")
          } catch (e) { }
        }

        // ---------- 5. 树形数据通用解析（管理机构、学术委员会） ----------
        // 递归遍历树形节点，拼接层级文本
        const parseTreeToText = (treeList, level = 0) => {
          if (!Array.isArray(treeList) || treeList.length === 0) return ''
          let result = ''
          const prefix = '　'.repeat(level) + (level > 0 ? '├─ ' : '')
          treeList.forEach(node => {
            result += prefix + (node.label || '未命名节点') + '\n'
            // 递归子节点
            if (Array.isArray(node.children) && node.children.length > 0) {
              result += parseTreeToText(node.children, level + 1)
            }
          })
          return result
        }

        // 管理机构设置
        if (data.organization_structure) {
          try {
            const treeArr = JSON.parse(data.organization_structure)
            data.organization_structure = parseTreeToText(treeArr) || '无'
          } catch (e) { }
        }

        // 学术/技术委员会组成
        if (data.academic_committee_structure) {
          try {
            const treeArr = JSON.parse(data.academic_committee_structure)
            data.academic_committee_structure = parseTreeToText(treeArr) || '无'
          } catch (e) { }
        }

        this.currentDetail = data
      }).catch(err => {
        this.$message.error("获取详情失败")
      })
    },

    async passApply(row) {
      this.$confirm("确定通过该申请？", "审批", { type: "success" }).then(async () => {
        try {
          await this.$axios.post('/audit/pass/', { id: row.id })
          this.auditRecordList.push({
            ...row,
            result: "approved",
            audit_time: new Date().toLocaleString(),
            reject_reason: "无"
          })
          this.pendingList = this.pendingList.filter(item => item.id !== row.id)
          this.$message.success("审批已通过")
        } catch (e) {
          this.$message.error("审批失败：" + (e.response?.data?.msg || ""))
        }
      })
    },

    async rejectApply(row) {
      this.$prompt("填写驳回原因", "驳回申请", { inputPlaceholder: "请输入原因" }).then(async ({ value }) => {
        try {
          await this.$axios.post('/audit/reject/', {
            id: row.id,
            reject_reason: value
          })
          this.auditRecordList.push({
            ...row,
            result: "rejected",
            audit_time: new Date().toLocaleString(),
            reject_reason: value
          })
          this.pendingList = this.pendingList.filter(item => item.id !== row.id)
          this.$message.success("已驳回")
        } catch (e) {
          this.$message.error("驳回失败")
        }
      })
    },

    handleLogout() {
      this.$confirm("确认退出登录？", "提示", { type: "warning" }).then(() => {
        localStorage.removeItem("user")
        this.$bus.$emit("login-success")
        this.$router.push("/login")
        this.$message.success("退出成功")
      })
    }
  }
}
</script>

<style scoped>
.user-page {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.user-info-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #eee;
}

.user-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-base {
  flex: 1;
}

.user-base h3 {
  margin: 0 0 10px;
  font-size: 20px;
  color: #333;
}

.user-base p {
  margin: 5px 0;
  color: #666;
}

.apply-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.empty-tip {
  text-align: center;
  padding: 40px 0;
  color: #999;
  font-size: 14px;
}

.avatar-small {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}

.avatar-uploader-icon {
  width: 70px;
  height: 70px;
  line-height: 70px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
}

/* 详情弹窗样式 */
.detail-container {
  font-size: 14px;
  line-height: 1.8;
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 10px;
}

.detail-head {
  padding: 12px;
  background: #f5f7fa;
  border-radius: 6px;
  margin-bottom: 20px;
}

.detail-block {
  margin-bottom: 24px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  overflow: hidden;
}

.block-title {
  margin: 0;
  padding: 10px 15px;
  background: #409eff;
  color: #fff;
  font-size: 15px;
}

.block-content {
  padding: 15px;
  background: #fff;
}

.rich-text-box {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
  margin: 6px 0 12px;
  min-height: 40px;
  white-space: pre-wrap;
}

/* 滚动条美化 */
.detail-container::-webkit-scrollbar {
  width: 6px;
}

.detail-container::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}
::v-deep .rich-text-box img {
  /* 最大宽度为详情容器的50% */
  max-width: 50% !important;
  /* 高度自动，保持原始宽高比，避免拉伸变形 */
  height: auto !important;
  /* 图片居中显示，上下左右留白 */
  display: block;
  margin: 12px auto !important;
  /* 保持和编辑页一致的圆角和阴影风格 */
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>