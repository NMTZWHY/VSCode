<template>
  <div class="user-page">
    <!-- 用户信息卡片 -->
    <div class="user-info-card">
      <div class="avatar-wrapper">
        <img :src="userInfo.avatar || 'https://cube.elemecdn.com/01/50/c73135d2786873e773122e8421e8epng.png'" 
             alt="用户头像" class="user-avatar">
      </div>
      <div class="user-base">
        <h3>{{ userInfo.username || '未知用户' }}</h3>
        <p>昵称：{{ userInfo.nickname || '未设置' }}</p>
        <p>真实姓名：{{ userInfo.real_name || '未设置' }}</p>
      </div>

      <!-- 新增：修改个人信息按钮 -->
      <el-button type="primary" icon="el-icon-user" @click="openEditDialog">
        修改个人信息
      </el-button>

      <el-button type="danger" icon="el-icon-switch-button" @click="handleLogout">
        退出登录
      </el-button>
    </div>

    <!-- 申报进度列表 -->
    <div class="apply-card">
      <div class="card-header">
        <h2>我的申报进度</h2>
        <el-button type="primary" icon="el-icon-plus" @click="$router.push('/apply')">新增申报</el-button>
      </div>
      
      <el-table 
        :data="applyList" 
        border 
        style="width: 100%"
        stripe>
        <el-table-column label="申报编号" prop="id" align="center"/>
        <el-table-column label="申报标题" prop="title" align="center"/>
        <el-table-column label="申报单位" prop="company" align="center"/>
        <el-table-column label="提交时间" prop="createTime" align="center"/>
        <el-table-column label="当前状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === '待审核' ? 'warning' 
              : scope.row.status === '已通过' ? 'success' : 'danger'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="viewDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="applyList.length === 0" class="empty-tip">
        暂无申报记录，点击右上角新增申报
      </div>
    </div>

    <!-- ====================== 新增：修改个人信息弹窗 ====================== -->
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
  </div>
</template>

<script>
export default {
  name: "UserPage",
  data() {
    return {
      userInfo: {},
      editVisible: false,
      editForm: {},
      applyList: [
        { id: "2025001", title: "项目立项申报", company: "测试公司", createTime: "2025-01-10 14:30", status: "待审核" },
        { id: "2025002", title: "经费申请申报", company: "测试公司", createTime: "2025-01-05 09:20", status: "已通过" },
        { id: "2025003", title: "成果验收申报", company: "测试公司", createTime: "2025-01-01 16:10", status: "已驳回" },
      ],
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      const user = localStorage.getItem("user");
      if (user) {
        this.userInfo = JSON.parse(user);
      }
    },

    // 打开编辑弹窗
    openEditDialog() {
      this.editForm = { ...this.userInfo };
      this.editVisible = true;
    },

    // ====================== 保存到后端（真实接口）======================
    async saveUserInfo() {
      try {
        // 调用后端修改用户信息接口
        const res = await this.$axios.post("/user/update", this.editForm);
        
        // 更新本地用户信息
        this.userInfo = { ...this.editForm };
        localStorage.setItem("user", JSON.stringify(this.userInfo));
        
        this.$message.success("个人信息修改成功！");
        this.editVisible = false;
        
        // 更新头部显示
        this.$bus.$emit("login-success");
      } catch (err) {
        this.$message.error(err.response?.data?.msg || "修改失败");
      }
    },

    // ====================== 上传头像到后端 ======================
    async uploadAvatar(params) {
      const file = params.file;
      const formData = new FormData();
      formData.append("file", file);
      
      try {
        const res = await this.$axios.post("/upload/avatar/", formData);
        let url = res.data.url;
        
        if (!url.startsWith("http")) {
          url = "http://localhost:8000" + url;
        }
        
        this.editForm.avatar = url;
        this.$message.success("头像上传成功");
      } catch (error) {
        this.$message.error("头像上传失败");
      }
    },

    // 头像校验
    beforeAvatarUpload(file) {
      const isImage = file.type.includes("image");
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isImage) this.$message.error("只能上传图片");
      if (!isLt2M) this.$message.error("不能超过2MB");
      return isImage && isLt2M;
    },

    viewDetail(row) {
      this.$message.info(`查看【${row.title}】详情`);
    },

    // 退出登录
    handleLogout() {
      this.$confirm("确定退出登录？", "提示", { type: "warning" })
        .then(() => {
          localStorage.removeItem("user");
          this.$bus.$emit("login-success");
          this.$router.push("/login");
          this.$message.success("退出成功");
        })
        .catch(() => {});
    },
  },
};
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
  margin: 0 0 10px 0;
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

/* 新增：弹窗头像样式 */
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
</style>