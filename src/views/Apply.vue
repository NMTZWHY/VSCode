<template>
  <div class="apply-page">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-title">
        <h1>科研平台入驻信息填报</h1>
        <p>带<span class="required">*</span>为必填项，请按步骤完成填写</p>
      </div>

      <!-- 步骤条 -->
      <el-steps :active="currentStep" finish-status="success" simple class="steps">
        <el-step v-for="(step, index) in stepList" :key="index" :title="step.title"></el-step>
      </el-steps>

      <!-- 表单卡片 -->
      <el-card class="form-card" shadow="never">
        <div style="text-align: right; margin-bottom: 15px;">
          <el-button size="small" @click="saveDraft" type="info" icon="el-icon-edit-outline">
            保存到草稿箱
          </el-button>
          <el-button size="small" @click="loadDraft" type="primary" icon="el-icon-refresh">
            读取草稿
          </el-button>
          <el-button size="small" @click="clearDraft" type="danger" icon="el-icon-delete">
            清空草稿
          </el-button>
          <el-button size="small" @click="clearCurrentAll" type="warning" icon="el-icon-delete">
            清空当前步骤信息
          </el-button>
        </div>

        <!-- 第一阶段：基本概况 -->
        <el-form v-if="currentStep === 0" ref="form0" :model="formData.step0" :rules="rules.step0" label-width="180px">
          <el-form-item label="平台名称(中文)" prop="nameCn">
            <el-input v-model="formData.step0.nameCn" placeholder="请输入平台中文名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="平台名称(英文)" prop="nameEn">
            <el-input v-model="formData.step0.nameEn" placeholder="请输入平台英文名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="平台类别" prop="category">
            <el-select v-model="formData.step0.category" placeholder="请选择平台类别" style="width: 100%" clearable>
              <el-option label="重点实验室" value="1"></el-option>
              <el-option label="技术创新中心" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="平台级别" prop="level">
            <el-select v-model="formData.step0.level" placeholder="请选择平台级别" style="width: 100%" clearable>
              <el-option label="国家级" value="1"></el-option>
              <el-option label="省级" value="2"></el-option>
              <el-option label="市级" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主管部门" prop="department">
            <el-input v-model="formData.step0.department" placeholder="请输入主管部门" clearable></el-input>
          </el-form-item>
          <el-form-item label="依托单位" prop="dependUnit">
            <el-input v-model="formData.step0.dependUnit" placeholder="请输入依托单位" clearable></el-input>
          </el-form-item>
          <el-form-item label="共建单位" prop="togetherUnit">
            <el-input v-model="formData.step0.togetherUnit" placeholder="请输入共建单位" clearable></el-input>
          </el-form-item>
          <el-form-item label="合作单位" prop="cooperateUnit">
            <el-input v-model="formData.step0.cooperateUnit" placeholder="请输入合作单位" clearable></el-input>
          </el-form-item>
          <el-form-item label="批准设立时间" prop="approveTime">
            <el-date-picker v-model="formData.step0.approveTime" type="date" value-format="yyyy-MM-dd"
              placeholder="请选择批准日期" style="width: 100%"></el-date-picker>
          </el-form-item>
          <el-form-item label="批准文号" prop="approveNo">
            <el-input v-model="formData.step0.approveNo" placeholder="请输入批准文号" clearable></el-input>
          </el-form-item>
          <el-form-item label="建设期" prop="validPeriod">
            <el-date-picker v-model="formData.step0.validPeriod" type="daterange" value-format="yyyy-MM-dd"
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%"
              :picker-options="datePickerOptions" clearable unlink-panels></el-date-picker>
          </el-form-item>
          <el-form-item label="验收状态" prop="acceptStatus">
            <el-select v-model="formData.step0.acceptStatus" placeholder="请选择验收状态" style="width: 100%" clearable>
              <el-option label="未验收" value="0" />
              <el-option label="已验收" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="平台定位" prop="position">
            <div class="rich-text-wrapper">
              <quill-editor v-model="formData.step0.position" :options="editorOption" @image-upload="handleQuillImg" />
            </div>
          </el-form-item>
          <el-form-item label="总体目标" prop="target">
            <div class="rich-text-wrapper">
              <quill-editor v-model="formData.step0.target" :options="editorOption" @image-upload="handleQuillImg" />
            </div>
          </el-form-item>
          <el-form-item label="主要研究方向" prop="direction">
            <div class="rich-text-wrapper">
              <quill-editor v-model="formData.step0.direction" :options="editorOption" @image-upload="handleQuillImg" />
            </div>
          </el-form-item>
        </el-form>

        <!-- 第二阶段：组织结构 -->
        <el-form v-if="currentStep === 1" ref="form1" :model="formData.step1" :rules="rules.step1" label-width="180px">
          <el-form-item label="平台负责人" prop="leader">
            <el-input v-model="formData.step1.leader" placeholder="请输入平台负责人姓名" clearable></el-input>
          </el-form-item>
          <el-form-item label="行政负责人" prop="adminLeader">
            <el-input v-model="formData.step1.adminLeader" placeholder="请输入行政负责人姓名" clearable></el-input>
          </el-form-item>
          <el-form-item label="技术负责人" prop="techLeader">
            <el-input v-model="formData.step1.techLeader" placeholder="请输入技术负责人姓名" clearable></el-input>
          </el-form-item>
          <el-form-item label="平台联系人" prop="contactName">
            <el-input v-model="formData.step1.contactName" placeholder="请输入联系人姓名" clearable></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input v-model="formData.step1.contactPhone" placeholder="请输入联系电话" clearable></el-input>
          </el-form-item>

          <el-form-item label="管理机构设置" prop="organizationStructure">
            <div class="tree-form-item">
              <horizontal-tree v-model="formData.step1.organizationStructure" :show-toolbar="true"
                default-node-label="新节点" />
            </div>
          </el-form-item>

          <el-form-item label="内部管理制度" prop="innerRule">
            <div class="rich-text-wrapper">
              <quill-editor v-model="formData.step1.innerRule" :options="editorOption" @image-upload="handleQuillImg" />
            </div>
          </el-form-item>
          <el-form-item label="学术/技术委员会组成" prop="academicCommitteeStructure">
            <div class="tree-form-item">
              <horizontal-tree v-model="formData.step1.academicCommitteeStructure" :show-toolbar="true"
                default-node-label="新节点" />
            </div>
          </el-form-item>

          <el-form-item label="学术/技术委员会职责" prop="academicCommitteeDuty">
            <div class="rich-text-wrapper">
              <quill-editor v-model="formData.step1.academicCommitteeDuty" :options="editorOption"
                @image-upload="handleQuillImg" />
            </div>
          </el-form-item>
        </el-form>

        <!-- 第三阶段：科研队伍 -->
        <el-form v-if="currentStep === 2" ref="form2" :model="formData.step2" :rules="rules.step2" label-width="180px">
          <el-form-item label="固定人员总数" prop="fixedPersonTotal">
            <el-input-number v-model="formData.step2.fixedPersonTotal" :min="0" style="width: 100%"></el-input-number>
          </el-form-item>
          <el-form-item label="核心骨干人数" prop="corePersonNum">
            <el-input-number v-model="formData.step2.corePersonNum" :min="0" style="width: 100%"></el-input-number>
          </el-form-item>
          <el-form-item label="人员职称结构" prop="titleStructure">
            <div class="table-form-wrapper">
              <el-table :data="titleStructureTable" border style="width: 100%" size="small">
                <el-table-column prop="title" label="职称" align="center">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.title" placeholder="请输入职称" clearable size="small"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="count" label="人数" align="center" width="150">
                  <template slot-scope="scope">
                    <el-input-number v-model="scope.row.count" :min="0" style="width: 100%"
                      size="small"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="100">
                  <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" size="small" circle
                      @click="deleteTitleRow(scope.$index)" :disabled="titleStructureTable.length <= 1"></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="table-add-btn">
                <el-button type="primary" icon="el-icon-plus" size="small" @click="addTitleRow">添加职称</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="人员学历结构" prop="educationStructure">
            <div class="table-form-wrapper">
              <el-table :data="educationStructureTable" border style="width: 100%" size="small">
                <el-table-column prop="education" label="学历" align="center">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.education" placeholder="请输入学历" clearable size="small"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="count" label="人数" align="center" width="150">
                  <template slot-scope="scope">
                    <el-input-number v-model="scope.row.count" :min="0" style="width: 100%"
                      size="small"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="100">
                  <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" size="small" circle
                      @click="deleteEducationRow(scope.$index)"
                      :disabled="educationStructureTable.length <= 1"></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="table-add-btn">
                <el-button type="primary" icon="el-icon-plus" size="small" @click="addEducationRow">添加学历</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="人员年龄结构" prop="ageStructure">
            <div class="table-form-wrapper">
              <el-table :data="ageStructureTable" border style="width: 100%" size="small">
                <el-table-column prop="ageRange" label="年龄段" align="center" width="150">
                  <template slot-scope="scope">
                    <span>{{ scope.row.ageRange }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="count" label="人数" align="center">
                  <template slot-scope="scope">
                    <el-input-number v-model="scope.row.count" :min="0" style="width: 100%"
                      size="small"></el-input-number>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>

          <el-form-item label="学术带头人信息" prop="academicLeader">
            <div class="table-form-wrapper">
              <el-table :data="academicLeaderTable" border style="width: 100%" size="small">
                <el-table-column prop="name" label="姓名" align="center" width="120">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.name" placeholder="请输入姓名" clearable size="small"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="gender" label="性别" align="center" width="100">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.gender" placeholder="请选择" clearable size="small" style="width: 100%">
                      <el-option label="男" value="男"></el-option>
                      <el-option label="女" value="女"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="age" label="年龄" align="center" width="80">
                  <template slot-scope="scope">
                    <el-input-number v-model="scope.row.age" :min="0" :max="150" style="width: 100%"
                      size="small"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column prop="title" label="职称" align="center" width="120">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.title" placeholder="请输入职称" clearable size="small"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="other" label="其他" align="center">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.other" type="textarea" :rows="2" placeholder="请输入其他信息" clearable
                      size="small"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="100">
                  <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" size="small" circle
                      @click="deleteAcademicLeaderRow(scope.$index)"
                      :disabled="academicLeaderTable.length <= 1"></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="table-add-btn">
                <el-button type="primary" icon="el-icon-plus" size="small"
                  @click="addAcademicLeaderRow">添加学术带头人</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="高层次人才情况" prop="highLevelTalent">
            <div class="rich-text-wrapper">
              <quill-editor v-model="formData.step2.highLevelTalent" :options="editorOption"
                @image-upload="handleQuillImg" />
            </div>
          </el-form-item>
          <el-form-item label="流动人员情况" prop="flowingPersonnel">
            <div class="rich-text-wrapper">
              <quill-editor v-model="formData.step2.flowingPersonnel" :options="editorOption"
                @image-upload="handleQuillImg" />
            </div>
          </el-form-item>
          <el-form-item label="人才培养机制" prop="talentTraining">
            <div class="rich-text-wrapper">
              <quill-editor v-model="formData.step2.talentTraining" :options="editorOption"
                @image-upload="handleQuillImg" />
            </div>
          </el-form-item>
        </el-form>

        <!-- 第四阶段：科研条件 -->
        <el-form v-if="currentStep === 3" ref="form3" :model="formData.step3" :rules="rules.step3" label-width="180px">
          <el-form-item label="科研用房面积" prop="roomArea">
            <el-input v-model="formData.step3.roomArea" placeholder="请填写面积，注明单位（如平方米）" clearable></el-input>
          </el-form-item>
          <el-form-item label="实验室数量" prop="labNum">
            <el-input-number v-model="formData.step3.labNum" :min="0" style="width: 100%"></el-input-number>
          </el-form-item>
          <el-form-item label="仪器设备总台套数" prop="equipmentTotal">
            <el-input-number v-model="formData.step3.equipmentTotal" :min="0" style="width: 100%"></el-input-number>
          </el-form-item>
          <el-form-item label="仪器设备总原值" prop="equipmentValue">
            <el-input v-model="formData.step3.equipmentValue" placeholder="请填写金额，注明单位（如万元）" clearable></el-input>
          </el-form-item>
          <el-form-item label="中试基地情况" prop="pilotBaseSituation">
            <div class="rich-text-wrapper">
              <quill-editor v-model="formData.step3.pilotBaseSituation" :options="editorOption"
                @image-upload="handleQuillImg" />
            </div>
          </el-form-item>
          <el-form-item label="主要大型仪器设备" prop="mainLargeEquipment">
            <div class="rich-text-wrapper">
              <quill-editor v-model="formData.step3.mainLargeEquipment" :options="editorOption"
                @image-upload="handleQuillImg" />
            </div>
          </el-form-item>
          <el-form-item label="资源库/数据库情况" prop="resourceDatabaseSituation">
            <div class="rich-text-wrapper">
              <quill-editor v-model="formData.step3.resourceDatabaseSituation" :options="editorOption"
                @image-upload="handleQuillImg" />
            </div>
          </el-form-item>
        </el-form>

        <!-- 第五阶段：科研成果 -->
        <el-form v-if="currentStep === 4" ref="form4" :model="formData.step4" :rules="rules.step4" label-width="180px">
          <el-form-item label="年度承担国家级项目数" prop="nationalProjectNum">
            <el-input-number v-model="formData.step4.nationalProjectNum" :min="0" style="width: 100%"></el-input-number>
          </el-form-item>
          <el-form-item label="年度承担省部级项目数" prop="provincialProjectNum">
            <el-input-number v-model="formData.step4.provincialProjectNum" :min="0"
              style="width: 100%"></el-input-number>
          </el-form-item>
          <el-form-item label="年度发表SCI/EI论文数" prop="sciEiPaperNum">
            <el-input-number v-model="formData.step4.sciEiPaperNum" :min="0" style="width: 100%"></el-input-number>
          </el-form-item>
          <el-form-item label="年度出版专著数" prop="monographNum">
            <el-input-number v-model="formData.step4.monographNum" :min="0" style="width: 100%"></el-input-number>
          </el-form-item>
          <el-form-item label="年度授权发明专利数" prop="inventionPatentNum">
            <el-input-number v-model="formData.step4.inventionPatentNum" :min="0" style="width: 100%"></el-input-number>
          </el-form-item>
          <el-form-item label="年度授权实用新型专利数" prop="utilityModelPatentNum">
            <el-input-number v-model="formData.step4.utilityModelPatentNum" :min="0"
              style="width: 100%"></el-input-number>
          </el-form-item>
          <el-form-item label="年度获得科技奖励数" prop="scienceAwardNum">
            <el-input-number v-model="formData.step4.scienceAwardNum" :min="0" style="width: 100%"></el-input-number>
          </el-form-item>
          <el-form-item label="奖励级别及名称" prop="awardLevelAndName">
            <div class="rich-text-wrapper">
              <quill-editor v-model="formData.step4.awardLevelAndName" :options="editorOption"
                @image-upload="handleQuillImg" />
            </div>
          </el-form-item>
          <el-form-item label="成果转化项目数" prop="achievementTransformationNum">
            <el-input-number v-model="formData.step4.achievementTransformationNum" :min="0"
              style="width: 100%"></el-input-number>
          </el-form-item>
          <el-form-item label="技术服务收入" prop="technicalServiceIncome">
            <el-input v-model="formData.step4.technicalServiceIncome" placeholder="请填写金额，注明单位（如万元）"
              clearable></el-input>
          </el-form-item>
        </el-form>

        <!-- 第六阶段：开放共享 -->
        <el-form v-if="currentStep === 5" ref="form5" :model="formData.step5" :rules="rules.step5" label-width="180px">
          <el-form-item label="对外开放机制" prop="openRule">
            <div class="rich-text-wrapper">
              <quill-editor v-model="formData.step5.openRule" :options="editorOption" @image-upload="handleQuillImg" />
            </div>
          </el-form-item>
          <el-form-item label="主要服务对象" prop="serviceTarget">
            <el-input v-model="formData.step5.serviceTarget" placeholder="请填写主要服务对象" clearable></el-input>
          </el-form-item>
          <el-form-item label="年度服务企业数" prop="serviceCompanyNum">
            <el-input-number v-model="formData.step5.serviceCompanyNum" :min="0" style="width: 100%"></el-input-number>
          </el-form-item>
          <el-form-item label="共享服务流程" prop="sharedServiceProcess">
            <div class="rich-text-wrapper">
              <quill-editor v-model="formData.step5.sharedServiceProcess" :options="editorOption"
                @image-upload="handleQuillImg" />
            </div>
          </el-form-item>
          <el-form-item label="预约方式" prop="reservationMethod">
            <div class="rich-text-wrapper">
              <quill-editor v-model="formData.step5.reservationMethod" :options="editorOption"
                @image-upload="handleQuillImg" />
            </div>
          </el-form-item>
          <el-form-item label="收费标准" prop="chargingStandard">
            <div class="rich-text-wrapper">
              <quill-editor v-model="formData.step5.chargingStandard" :options="editorOption"
                @image-upload="handleQuillImg" />
            </div>
          </el-form-item>
          <el-form-item label="年度服务收入总额" prop="annualServiceIncome">
            <el-input v-model="formData.step5.annualServiceIncome" placeholder="请填写金额，注明单位（如万元）" clearable></el-input>
          </el-form-item>
          <el-form-item label="产学研合作项目数" prop="industryUniversityResearchProjectNum">
            <el-input-number v-model="formData.step5.industryUniversityResearchProjectNum" :min="0"
              style="width: 100%"></el-input-number>
          </el-form-item>
          <el-form-item label="科普与培训活动次数" prop="popularScienceTrainingActivityNum">
            <el-input-number v-model="formData.step5.popularScienceTrainingActivityNum" :min="0"
              style="width: 100%"></el-input-number>
          </el-form-item>
        </el-form>

        <!-- 第七阶段：运行管理 -->
        <el-form v-if="currentStep === 6" ref="form6" :model="formData.step6" :rules="rules.step6" label-width="180px">
          <el-form-item label="年度经费总额" prop="yearFundTotal">
            <el-input v-model="formData.step6.yearFundTotal" placeholder="请填写金额，注明单位（如万元）" clearable></el-input>
          </el-form-item>
          <el-form-item label="资产管理情况" prop="assetManage">
            <div class="rich-text-wrapper">
              <quill-editor v-model="formData.step6.assetManage" :options="editorOption"
                @image-upload="handleQuillImg" />
            </div>
          </el-form-item>
          <el-form-item label="安全管理制度" prop="safeRule">
            <div class="rich-text-wrapper">
              <quill-editor v-model="formData.step6.safeRule" :options="editorOption" @image-upload="handleQuillImg" />
            </div>
          </el-form-item>
          <el-form-item label="中长期发展规划" prop="longTermPlan">
            <div class="rich-text-wrapper">
              <quill-editor v-model="formData.step6.longTermPlan" :options="editorOption"
                @image-upload="handleQuillImg" />
            </div>
          </el-form-item>
          <el-form-item label="经费来源结构" prop="fundingSourceStructure">
            <div class="rich-text-wrapper">
              <quill-editor v-model="formData.step6.fundingSourceStructure" :options="editorOption"
                @image-upload="handleQuillImg" />
            </div>
          </el-form-item>
          <el-form-item label="年度工作计划" prop="annualWorkPlan">
            <div class="rich-text-wrapper">
              <quill-editor v-model="formData.step6.annualWorkPlan" :options="editorOption"
                @image-upload="handleQuillImg" />
            </div>
          </el-form-item>
          <el-form-item label="存在主要问题" prop="mainProblems">
            <div class="rich-text-wrapper">
              <quill-editor v-model="formData.step6.mainProblems" :options="editorOption"
                @image-upload="handleQuillImg" />
            </div>
          </el-form-item>
          <el-form-item label="改进措施" prop="improvementMeasures">
            <div class="rich-text-wrapper">
              <quill-editor v-model="formData.step6.improvementMeasures" :options="editorOption"
                @image-upload="handleQuillImg" />
            </div>
          </el-form-item>
          <el-form-item label="年度工作总结" prop="annualWorkSummary">
            <div class="rich-text-wrapper">
              <quill-editor v-model="formData.step6.annualWorkSummary" :options="editorOption"
                @image-upload="handleQuillImg" />
            </div>
          </el-form-item>
          <el-form-item label="运行绩效考核结果" prop="performanceEvaluationResult">
            <div class="rich-text-wrapper">
              <quill-editor v-model="formData.step6.performanceEvaluationResult" :options="editorOption"
                @image-upload="handleQuillImg" />
            </div>
          </el-form-item>
        </el-form>

        <!-- 操作按钮 -->
        <div class="btn-group">
          <el-button v-if="currentStep > 0" @click="prevStep" size="medium">上一步</el-button>
          <el-button v-if="currentStep < stepList.length - 1" type="primary" @click="nextStep" :loading="stepLoading"
            size="medium">下一步</el-button>
          <el-button v-if="currentStep === stepList.length - 1" type="success" @click="submitForm"
            :loading="submitLoading" size="medium">提交入驻申请</el-button>
        </div>
      </el-card>

      <!-- 进度提示 -->
      <div class="progress-tip">
        <p>填报进度：{{ currentStep + 1 }} / {{ stepList.length }} 阶段</p>
      </div>
    </div>

    <!-- 富文本隐藏图片上传组件 -->
    <el-upload ref="quillUpload" action="#" :show-file-list="false" :auto-upload="true" :http-request="customUpload"
      :before-upload="beforeUploadCheck" accept="image/jpeg,image/png,image/gif" style="display: none;">
    </el-upload>
  </div>
</template>

<script>
import { submitApplication, uploadRichImg } from '@/api/research'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import HorizontalTree from '@/components/HorizontalTree/HorizontalTree.vue'

// ==================== 自定义字体配置 ====================
const fontList = [
  'SimSun',
  'SimHei',
  'Microsoft-YaHei',
  'KaiTi',
  'FangSong',
  'Arial',
  'Times-New-Roman',
  'sans-serif'
]
const Font = Quill.import('formats/font')
Font.whitelist = fontList
Quill.register(Font, true)

const sizeList = [
  '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'
]
const Size = Quill.import('formats/size')
Size.whitelist = sizeList
Quill.register(Size, true)

const Align = Quill.import('attributors/style/align')
const Icons = Quill.import('ui/icons')
Icons.align['left'] = Icons.align['']
Align.whitelist = ['left', 'center', 'right', 'justify']
Quill.register(Align, true)

export default {
  name: 'ResearchApply',
  components: {
    quillEditor,
    HorizontalTree
  },
  data() {
    return {
      // uploadImgUrl: '/upload/image',
      uploadLoading: false,
      currentQuill: null,
      currentStep: 0,
      stepLoading: false,
      submitLoading: false,
      editorOption: {
        placeholder: '请输入内容...',
        modules: {
          toolbar: [
            [{ 'font': fontList }, { 'size': sizeList }],
            ['bold', 'italic', 'underline'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': ['left', 'center', 'right', 'justify'] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['table', 'image'],
            ['clean']
          ]
        },
        // 必须显式声明！否则不生效
        formats: [
          'font', 'size',
          'bold', 'italic', 'underline',
          'color', 'background',
          'align',
          'list', 'bullet',
          'table', 'image',  // 必须加上image！
          'clean'
        ]
      },
      datePickerOptions: {
        disabledDate: (time) => {
          const now = new Date()
          const globalMinDate = new Date(now.getFullYear() - 100, 0, 1)
          const globalMaxDate = new Date(now.getFullYear() + 100, 11, 31)
          if (this.selectedStartDate) {
            const maxAllowedDate = new Date(this.selectedStartDate)
            maxAllowedDate.setFullYear(maxAllowedDate.getFullYear() + 100)
            return time.getTime() < globalMinDate.getTime() ||
              time.getTime() > globalMaxDate.getTime() ||
              time.getTime() > maxAllowedDate.getTime()
          }
          return time.getTime() < globalMinDate.getTime() || time.getTime() > globalMaxDate.getTime()
        }
      },
      stepList: [
        { title: "基本概况" },
        { title: "组织结构" },
        { title: "科研队伍" },
        { title: "科研条件" },
        { title: "科研成果" },
        { title: "开放共享" },
        { title: "运行管理" }
      ],
      formData: {
        step0: {
          nameCn: '', nameEn: '', category: '', level: '', department: '',
          dependUnit: '', togetherUnit: '', cooperateUnit: '', approveTime: '',
          approveNo: '', validPeriod: [], acceptStatus: '', position: '',
          target: '', direction: ''
        },
        step1: {
          leader: '', adminLeader: '', techLeader: '', contactName: '',
          contactPhone: '', organizationStructure: [], academicCommitteeStructure: [], innerRule: '', academicCommitteeDuty: ''
        },
        step2: {
          fixedPersonTotal: 0, corePersonNum: 0, titleStructure: '',
          educationStructure: '', academicLeader: '', highLevelTalent: '',
          flowingPersonnel: '', talentTraining: '', ageStructure: ''
        },
        step3: {
          roomArea: '', labNum: 0, equipmentTotal: 0, equipmentValue: '', pilotBaseSituation: '',
          mainLargeEquipment: '', resourceDatabaseSituation: ''
        },
        step4: {
          nationalProjectNum: 0, provincialProjectNum: 0, sciEiPaperNum: 0,
          monographNum: 0, inventionPatentNum: 0, utilityModelPatentNum: 0,
          scienceAwardNum: 0, awardLevelAndName: '', achievementTransformationNum: 0,
          technicalServiceIncome: ''
        },
        step5: {
          openRule: '', serviceTarget: '', serviceCompanyNum: 0, sharedServiceProcess: '',
          reservationMethod: '', chargingStandard: '', annualServiceIncome: '',
          industryUniversityResearchProjectNum: 0, popularScienceTrainingActivityNum: 0
        },
        step6: {
          yearFundTotal: '', assetManage: '', safeRule: '', longTermPlan: '', fundingSourceStructure: '',
          annualWorkPlan: '', mainProblems: '', improvementMeasures: '',
          annualWorkSummary: '', performanceEvaluationResult: ''
        }
      },
      titleStructureTable: [
        { title: '正高级', count: 0 },
        { title: '副高级', count: 0 },
        { title: '中级', count: 0 },
        { title: '助理级', count: 0 },
        { title: '员级', count: 0 }
      ],
      educationStructureTable: [
        { education: '博士', count: 0 },
        { education: '硕士', count: 0 },
        { education: '本科', count: 0 }
      ],
      ageStructureTable: [
        { ageRange: '60岁以上', count: 0 },
        { ageRange: '50-60岁', count: 0 },
        { ageRange: '40-50岁', count: 0 },
        { ageRange: '30-40岁', count: 0 },
        { ageRange: '30岁以下', count: 0 }
      ],
      academicLeaderTable: [
        { name: '', gender: '', age: 0, title: '', other: '' }
      ],
      rules: {
        step0: {
          nameCn: [{ required: true, message: '请输入平台中文名称', trigger: 'blur' }],
          nameEn: [{ required: true, message: '请输入平台英文名称', trigger: 'blur' }],
          category: [{ required: true, message: '请选择平台类别', trigger: 'change' }],
          level: [{ required: true, message: '请选择平台级别', trigger: 'change' }],
          department: [{ required: true, message: '请输入主管部门', trigger: 'blur' }],
          dependUnit: [{ required: true, message: '请输入依托单位', trigger: 'blur' }],
          approveTime: [{ required: true, message: '请选择批准设立时间', trigger: 'change' }],
          approveNo: [{ required: true, message: '请输入批准文号', trigger: 'blur' }],
          position: [{ required: true, message: '请输入平台定位', trigger: 'blur' }],
          target: [{ required: true, message: '请输入总体目标', trigger: 'blur' }],
          direction: [{ required: true, message: '请输入主要研究方向', trigger: 'blur' }]
        },
        step1: {
          leader: [{ required: true, message: '请输入平台负责人', trigger: 'blur' }],
          innerRule: [{ required: true, message: '请填写内部管理制度', trigger: 'blur' }]
        },
        step2: {
          fixedPersonTotal: [{ required: true, message: '请输入固定人员总数', trigger: 'blur' }],
          corePersonNum: [{ required: true, message: '请输入核心骨干人数', trigger: 'blur' }],
          titleStructure: [
            { required: true, message: '请填写人员职称结构', trigger: 'blur' },
            { validator: this.validateTitleStructure, trigger: 'blur' }
          ],
          educationStructure: [
            { required: true, message: '请填写人员学历结构', trigger: 'blur' },
            { validator: this.validateEducationStructure, trigger: 'blur' }
          ],
          academicLeader: [
            { required: true, message: '请填写学术带头人信息', trigger: 'blur' },
            { validator: this.validateAcademicLeader, trigger: 'blur' }
          ]
        },
        step3: {
          roomArea: [{ required: true, message: '请输入科研用房面积', trigger: 'blur' }],
          labNum: [{ required: true, message: '请输入实验室数量', trigger: 'blur' }],
          equipmentTotal: [{ required: true, message: '请输入仪器设备总台套数', trigger: 'blur' }],
          equipmentValue: [{ required: true, message: '请输入仪器设备总原值', trigger: 'blur' }]
        },
        step4: {
          nationalProjectNum: [{ required: true, message: '请输入年度国家级项目数', trigger: 'blur' }],
          provincialProjectNum: [{ required: true, message: '请输入年度省部级项目数', trigger: 'blur' }]
        },
        step5: {
          openRule: [{ required: true, message: '请填写对外开放机制', trigger: 'blur' }],
          serviceTarget: [{ required: true, message: '请输入主要服务对象', trigger: 'blur' }],
          serviceCompanyNum: [{ required: true, message: '请输入年度服务企业数', trigger: 'blur' }]
        },
        step6: {
          yearFundTotal: [{ required: true, message: '请输入年度经费总额', trigger: 'blur' }],
          assetManage: [{ required: true, message: '请填写资产管理情况', trigger: 'blur' }],
          safeRule: [{ required: true, message: '请填写安全管理制度', trigger: 'blur' }],
          longTermPlan: [{ required: true, message: '请填写中长期发展规划', trigger: 'blur' }]
        }
      }
    }
  },
  watch: {
    titleStructureTable: {
      handler(newVal) {
        const validData = newVal.filter(item => item.title.trim() !== '')
        this.formData.step2.titleStructure = JSON.stringify(validData)
      }, deep: true
    },
    educationStructureTable: {
      handler(newVal) {
        const validData = newVal.filter(item => item.education.trim() !== '')
        this.formData.step2.educationStructure = JSON.stringify(validData)
      }, deep: true
    },
    ageStructureTable: {
      handler(newVal) {
        this.formData.step2.ageStructure = JSON.stringify(newVal)
      }, deep: true
    },
    academicLeaderTable: {
      handler(newVal) {
        const validData = newVal.filter(item => item.name.trim() !== '')
        this.formData.step2.academicLeader = JSON.stringify(validData)
      }, deep: true
    }
  },
  mounted() {
    this.autoLoadDraft()
  },
  methods: {
    // 清空当前步骤所有内容（带确认提示）
    clearCurrentAll() {
      this.$confirm('确定要清空当前步骤填写的所有内容吗？此操作不可恢复！', '提示', {
        confirmButtonText: '确定清空',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const formKey = `step${this.currentStep}`
        this.formData[formKey] = this.$options.data().formData[formKey]

        if (this.$refs[`form${this.currentStep}`]) {
          this.$refs[`form${this.currentStep}`].clearValidate()
        }
        this.$message.success('已清空当前步骤所有内容！')
      }).catch(() => {
        this.$message.info('已取消清空')
      })
    },
    // ==================== 草稿箱核心功能 ====================
    saveDraft() {
      const draft = {
        formData: JSON.parse(JSON.stringify(this.formData)),
        titleStructureTable: JSON.parse(JSON.stringify(this.titleStructureTable)),
        educationStructureTable: JSON.parse(JSON.stringify(this.educationStructureTable)),
        ageStructureTable: JSON.parse(JSON.stringify(this.ageStructureTable)),
        academicLeaderTable: JSON.parse(JSON.stringify(this.academicLeaderTable)),
        currentStep: this.currentStep
      }
      localStorage.setItem('research_apply_draft', JSON.stringify(draft))
      this.$message.success('草稿保存成功！')
    },

    loadDraft() {
      const draft = localStorage.getItem('research_apply_draft')
      if (!draft) {
        this.$message.warning('暂无草稿数据')
        return
      }
      const parsed = JSON.parse(draft)
      this.formData = parsed.formData
      this.titleStructureTable = parsed.titleStructureTable
      this.educationStructureTable = parsed.educationStructureTable
      this.ageStructureTable = parsed.ageStructureTable
      this.academicLeaderTable = parsed.academicLeaderTable
      this.currentStep = parsed.currentStep || 0
      this.$message.success('草稿读取成功！')
    },

    clearDraft() {
      this.$confirm('确定要清空所有草稿数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('research_apply_draft')
        this.$message.success('草稿已清空')
      }).catch(() => { })
    },

    autoLoadDraft() {
      const draft = localStorage.getItem('research_apply_draft')
      if (draft) {
        this.$confirm('检测到未完成的草稿，是否加载？', '提示', {
          confirmButtonText: '加载草稿',
          cancelButtonText: '重新填写',
          type: 'info'
        }).then(() => {
          this.loadDraft()
        }).catch(() => { })
      }
    },

    handleQuillImg(quill) {
      this.currentQuill = quill
      // 阻止Quill原生默认图片弹窗，避免弹出两个文件选择框
      quill.format('image', false)
      // 触发隐藏上传组件的文件选择
      this.$refs.quillUpload.$refs.upload.click()
    },
    beforeUploadCheck(file) {
      const allowTypes = ['image/jpeg', 'image/png', 'image/gif']
      const isTypeOk = allowTypes.includes(file.type)
      const isSizeOk = file.size / 1024 / 1024 < 2 // 限制2MB

      if (!isTypeOk) {
        this.$message.error('仅支持 JPG / PNG / GIF 格式图片')
        return false // 校验失败，终止上传
      }
      if (!isSizeOk) {
        this.$message.error('图片大小不能超过 2MB')
        return false
      }
      return true // 校验通过，继续上传
    },
    async customUpload(option) {
      // el-upload 自定义上传会传入 option 对象，option.file 就是选中的文件
      const file = option.file

      try {
        // 直接调用你已封装好的上传接口
        const res = await uploadRichImg(file)

        // 按你后端返回格式判断结果
        if (res.code === 200 && res.data && res.data.url) {
          // 获取富文本光标位置
          const range = this.currentQuill.getSelection(true)
          // 插入图片到光标位置
          this.currentQuill.insertEmbed(range.index, 'image', res.data.url)
          // 光标后移一位，提升操作体验
          this.currentQuill.setSelection(range.index + 1)
        } else {
          this.$message.error(res.msg || '图片上传失败')
        }
      } catch (err) {
        this.$message.error('上传请求异常，请检查网络或接口')
        console.error('图片上传报错：', err)
      }
    },
    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--
        window.scrollTo(0, 0)
      }
    },
    nextStep() {
      this.stepLoading = true
      const formRefs = [this.$refs.form0, this.$refs.form1, this.$refs.form2, this.$refs.form3, this.$refs.form4, this.$refs.form5, this.$refs.form6]
      const formRef = formRefs[this.currentStep]
      if (!formRef) {
        this.$message.warning('表单加载异常，请刷新页面')
        this.stepLoading = false
        return
      }
      formRef.validate((valid) => {
        if (valid) {
          this.currentStep++
          window.scrollTo(0, 0)
        } else {
          this.$message.warning('请完成当前阶段所有必填项')
        }
        this.stepLoading = false
      })
    },
    submitForm() {
      this.submitLoading = true
      const formRefs = [this.$refs.form0, this.$refs.form1, this.$refs.form2, this.$refs.form3, this.$refs.form4, this.$refs.form5, this.$refs.form6]
      const formRef = formRefs[this.currentStep]
      if (!formRef) {
        this.$message.warning('表单加载异常，请刷新页面')
        this.submitLoading = false
        return
      }
      formRef.validate((valid) => {
        if (valid) {
          const fullData = {}
          Object.values(this.formData).forEach(stepForm => {
            Object.assign(fullData, stepForm)
          })
          // ==========关键修复：daterange数组拼接字符串==========
          if (Array.isArray(fullData.validPeriod)) {
            // 选了日期 → 拼接
            if (fullData.validPeriod.length === 2) {
              fullData.validPeriod = fullData.validPeriod.join('~')
            }
            // 空数组 → 赋值字符串"无"
            else {
              fullData.validPeriod = "无"
            }
          }
          // 验收状态空值赋值0
          if (fullData.acceptStatus === '') fullData.acceptStatus = '0'
          if (Array.isArray(fullData.organizationStructure)) {
            fullData.organizationStructure = JSON.stringify(fullData.organizationStructure)
          }
          if (Array.isArray(fullData.academicCommitteeStructure)) {
            fullData.academicCommitteeStructure = JSON.stringify(fullData.academicCommitteeStructure)
          }
          const backendData = this.convertToSnakeCase(fullData)
          submitApplication(backendData)
            .then(() => {
              localStorage.removeItem('research_apply_draft')
              this.$message.success('入驻申请提交成功！草稿已自动清空')
              this.$router.push('/')
            })
            .catch(() => {
              this.$message.error('提交失败，请稍后重试')
            })
            .finally(() => {
              this.submitLoading = false
            })
        } else {
          this.$message.warning('请完成当前阶段所有必填项')
          this.submitLoading = false
        }
      })
    },
    convertToSnakeCase(obj) {
      const snakeObj = {}
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
          snakeObj[snakeKey] = obj[key]
        }
      }
      return snakeObj
    },
    addTitleRow() {
      this.titleStructureTable.push({ title: '', count: 0 })
    },
    deleteTitleRow(index) {
      if (this.titleStructureTable.length > 1) {
        this.titleStructureTable.splice(index, 1)
      }
    },
    validateTitleStructure(rule, value, callback) {
      const hasValidData = this.titleStructureTable.some(item =>
        item.title.trim() !== '' && item.count > 0
      )
      if (!hasValidData) {
        callback(new Error('请至少添加一个有效职称并填写人数'))
      } else {
        callback()
      }
    },
    addEducationRow() {
      this.educationStructureTable.push({ education: '', count: 0 })
    },
    deleteEducationRow(index) {
      if (this.educationStructureTable.length > 1) {
        this.educationStructureTable.splice(index, 1)
      }
    },
    validateEducationStructure(rule, value, callback) {
      const hasValidData = this.educationStructureTable.some(item =>
        item.education.trim() !== '' && item.count > 0
      )
      if (!hasValidData) {
        callback(new Error('请至少添加一个有效学历并填写人数'))
      } else {
        callback()
      }
    },
    addAcademicLeaderRow() {
      this.academicLeaderTable.push({ name: '', gender: '', age: 0, title: '', other: '' })
    },
    deleteAcademicLeaderRow(index) {
      if (this.academicLeaderTable.length > 1) {
        this.academicLeaderTable.splice(index, 1)
      }
    },
    validateAcademicLeader(rule, value, callback) {
      const hasValidData = this.academicLeaderTable.some(item =>
        item.name.trim() !== ''
      )
      if (!hasValidData) {
        callback(new Error('请至少添加一位学术带头人并填写姓名'))
      } else {
        callback()
      }
    }
  }
}
</script>

<style scoped>
.apply-page {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px 0;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 15px;
}

.page-title {
  text-align: center;
  margin-bottom: 20px;
}

.page-title h1 {
  font-size: 24px;
  color: #303133;
  margin: 0 0 8px 0;
}

.page-title p {
  font-size: 14px;
  color: #606266;
  margin: 0;
}

.required {
  color: #f56c6c;
}

.steps {
  margin-bottom: 20px;
  padding: 15px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #ebeef5;
}

.form-card {
  padding: 25px;
  margin-bottom: 15px;
}

.btn-group {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.progress-tip {
  text-align: center;
  padding: 10px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #ebeef5;
}

.progress-tip p {
  margin: 0;
  font-size: 14px;
  color: #606266;
}

.rich-text-wrapper {
  width: 100%;
  position: relative !important;
  z-index: 9999 !important;
  overflow: visible !important;
}

::v-deep .rich-text-wrapper .quill {
  display: flex !important;
  flex-direction: column !important;
  width: 100% !important;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: visible !important;
  position: relative !important;
  z-index: 9999 !important;
}

::v-deep .rich-text-wrapper .quill:focus-within {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

::v-deep .rich-text-wrapper .ql-toolbar.ql-snow {
  width: 100% !important;
  border: none !important;
  border-bottom: 1px solid #dcdfe6 !important;
  background-color: #fafafa;
  padding: 4px 6px !important;
  display: flex !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 0 !important;
  overflow: visible !important;
  white-space: nowrap !important;
  position: relative !important;
  z-index: 99999 !important;
}

::v-deep .rich-text-wrapper .ql-toolbar.ql-snow button {
  height: 22px !important;
  width: 22px !important;
  padding: 2px !important;
  margin: 0 1px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 2px !important;
  flex-shrink: 0 !important;
}

::v-deep .rich-text-wrapper .ql-toolbar.ql-snow button:hover {
  background-color: #e8f3ff !important;
}

::v-deep .rich-text-wrapper .ql-toolbar.ql-snow button.ql-active {
  background-color: #409eff !important;
  color: #fff !important;
}

::v-deep .rich-text-wrapper .ql-toolbar.ql-snow .ql-picker {
  height: 22px !important;
  margin: 0 1px !important;
  display: inline-flex !important;
  align-items: center !important;
  flex-shrink: 0 !important;
}

::v-deep .rich-text-wrapper .ql-toolbar.ql-snow .ql-picker-label {
  padding: 0 4px !important;
  line-height: 22px !important;
}

::v-deep .ql-snow .ql-picker.ql-font {
  width: 150px !important;
}

::v-deep .ql-snow .ql-picker.ql-size {
  width: 80px !important;
}

::v-deep .ql-snow .ql-picker.ql-align {
  width: 30px !important;
}

::v-deep .ql-snow .ql-picker.ql-align .ql-picker-label svg {
  width: 16px !important;
  height: 16px !important;
  margin: 0 !important;
}

::v-deep .rich-text-wrapper .ql-toolbar.ql-snow .ql-formats {
  margin-right: 4px !important;
  padding-right: 4px !important;
  border-right: 1px solid #e0e0e0 !important;
  display: inline-flex !important;
  align-items: center !important;
  flex-shrink: 0 !important;
  position: relative !important;
  z-index: 99999 !important;
}

::v-deep .rich-text-wrapper .ql-toolbar.ql-snow .ql-formats:last-child {
  margin-right: 0 !important;
  padding-right: 0 !important;
  border-right: none !important;
}

::v-deep .rich-text-wrapper .ql-container.ql-snow {
  width: 100% !important;
  border: none !important;
  font-size: 14px;
  position: relative !important;
  z-index: 1 !important;
}

::v-deep .rich-text-wrapper .ql-editor {
  padding: 10px 12px;
  min-height: 120px;
  line-height: 1.6;
}

::v-deep .rich-text-wrapper .ql-editor.ql-blank::before {
  left: 12px;
  right: 12px;
  color: #c0c4cc;
  font-style: normal;
}

::v-deep .el-form-item {
  margin-bottom: 22px !important;
  position: relative !important;
  z-index: 1 !important;
}

::v-deep .rich-text-wrapper .ql-editor table {
  border-collapse: collapse;
  width: 100%;
  margin: 10px 0;
}

::v-deep .rich-text-wrapper .ql-editor table td,
::v-deep .rich-text-wrapper .ql-editor table th {
  border: 1px solid #ccc;
  padding: 6px 10px;
  min-width: 80px;
}

::v-deep .ql-snow .ql-picker.ql-expanded .ql-picker-options {
  z-index: 999999 !important;
  position: absolute !important;
  top: 100% !important;
  left: 0 !important;
  max-height: 120px !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2) !important;
  border: 1px solid #dcdfe6 !important;
  border-radius: 4px !important;
  background-color: #fff !important;
  margin-top: 2px !important;
}

::v-deep .ql-snow .ql-picker.ql-align.ql-expanded .ql-picker-options {
  overflow-x: visible !important;
  width: auto !important;
  min-width: 40px !important;
}

::v-deep .ql-snow .ql-picker.ql-align .ql-picker-item svg {
  width: 16px !important;
  height: 16px !important;
  margin: 0 !important;
}

::v-deep .ql-snow .ql-picker.ql-expanded.ql-picker-up .ql-picker-options {
  top: auto !important;
  bottom: 100% !important;
  margin-top: 0 !important;
  margin-bottom: 2px !important;
}

::v-deep .ql-snow .ql-picker-options::-webkit-scrollbar {
  width: 6px !important;
  height: 6px !important;
}

::v-deep .ql-snow .ql-picker-options::-webkit-scrollbar-thumb {
  background-color: #409eff !important;
  border-radius: 3px !important;
}

::v-deep .ql-snow .ql-picker-options::-webkit-scrollbar-track {
  background-color: #f5f7fa !important;
  border-radius: 3px !important;
}

::v-deep .ql-snow .ql-picker-options .ql-picker-item {
  padding: 6px 12px !important;
  line-height: 1.5 !important;
  height: 30px !important;
  box-sizing: border-box !important;
}

::v-deep .ql-snow .ql-picker-options .ql-picker-item:hover {
  background-color: #e8f3ff !important;
}

::v-deep .ql-snow .ql-picker-options .ql-picker-item.ql-selected {
  background-color: #409eff !important;
  color: #fff !important;
}

::v-deep .ql-font-SimSun {
  font-family: "SimSun";
}

::v-deep .ql-font-SimHei {
  font-family: "SimHei";
}

::v-deep .ql-font-Microsoft-YaHei {
  font-family: "Microsoft YaHei";
}

::v-deep .ql-font-KaiTi {
  font-family: "KaiTi";
}

::v-deep .ql-font-FangSong {
  font-family: "FangSong";
}

::v-deep .ql-font-Arial {
  font-family: "Arial";
}

::v-deep .ql-font-Times-New-Roman {
  font-family: "Times New Roman";
}

::v-deep .ql-font-sans-serif {
  font-family: "sans-serif";
}

::v-deep .ql-size-12px {
  font-size: 12px;
}

::v-deep .ql-size-14px {
  font-size: 14px;
}

::v-deep .ql-size-16px {
  font-size: 16px;
}

::v-deep .ql-size-18px {
  font-size: 18px;
}

::v-deep .ql-size-20px {
  font-size: 20px;
}

::v-deep .ql-size-24px {
  font-size: 24px;
}

::v-deep .ql-size-28px {
  font-size: 28px;
}

::v-deep .ql-size-32px {
  font-size: 32px;
}

.tree-form-item {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.tree-form-item:focus-within {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

::v-deep .tree-form-item .custom-horizontal-tree {
  padding: 0 !important;
  background-color: #fff !important;
  min-height: auto !important;
}

::v-deep .tree-form-item .tree-toolbar {
  margin-bottom: 0 !important;
  padding: 10px 15px !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  border-bottom: 1px solid #ebeef5;
}

::v-deep .tree-form-item .tree-container {
  padding: 15px !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  min-height: 200px;
}
::v-deep .rich-text-wrapper .ql-editor img {
  /* 最大宽度为编辑框的85%，不会占满整个宽度 */
  max-width: 50% !important;
  /* 高度自动，保持原始宽高比，避免拉伸变形 */
  height: auto !important;
  /* 图片居中显示，上下左右留白 */
  display: block;
  margin: 12px auto !important;
  /* 可选：添加圆角和轻微阴影，提升美观度 */
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>
<style>
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="SimSun"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="SimSun"]::before {
  content: "宋体";
  font-family: SimSun;
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="SimHei"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="SimHei"]::before {
  content: "黑体";
  font-family: SimHei;
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="Microsoft-YaHei"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="Microsoft-YaHei"]::before {
  content: "微软雅黑";
  font-family: "Microsoft YaHei";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="KaiTi"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="KaiTi"]::before {
  content: "楷体";
  font-family: KaiTi;
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="FangSong"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="FangSong"]::before {
  content: "仿宋";
  font-family: FangSong;
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="Arial"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="Arial"]::before {
  content: "Arial";
  font-family: Arial;
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="Times-New-Roman"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="Times-New-Roman"]::before {
  content: "Times New Roman";
  font-family: "Times New Roman";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="sans-serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="sans-serif"]::before {
  content: "系统默认";
  font-family: sans-serif;
}

/* 字号显示 */
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="12px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before {
  content: "12px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="14px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before {
  content: "14px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="16px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before {
  content: "16px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="18px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before {
  content: "18px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="20px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before {
  content: "20px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="24px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before {
  content: "24px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="28px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="28px"]::before {
  content: "28px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="32px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="32px"]::before {
  content: "32px";
}
</style>