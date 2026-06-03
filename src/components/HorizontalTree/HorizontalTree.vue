<!-- src/components/HorizontalTree/HorizontalTree.vue -->
<template>
  <div class="custom-horizontal-tree">
    <!-- 工具栏 -->
    <div v-if="showToolbar" class="tree-toolbar">
      <el-button 
        type="primary" 
        icon="el-icon-plus" 
        size="small"
        @click="addRootNode"
      >
        添加根节点
      </el-button>
      <el-button 
        type="warning" 
        icon="el-icon-refresh" 
        size="small"
        @click="resetTree"
      >
        重置
      </el-button>
    </div>

    <!-- 树形结构容器：整体垂直居中 -->
    <div class="tree-container">
      <div class="tree-level root-level">
        <TreeNode
          v-for="(node, index) in innerTreeData"
          :key="node.id"
          :node="node"
          :level="0"
          :index="index"
          :parent-children="innerTreeData"
          @add-child="addChildNode"
          @add-sibling="addSiblingNode"
          @delete-node="deleteNode"
          @update-label="updateNodeLabel"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TreeNode from './TreeNode.vue'

export default {
  name: 'HorizontalTree',
  components: {
    TreeNode
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    showToolbar: {
      type: Boolean,
      default: true
    },
    defaultNodeLabel: {
      type: String,
      default: '新节点'
    }
  },
  data() {
    return {
      innerTreeData: [],
      idCounter: 100
    }
  },
  watch: {
    value: {
      handler(newVal) {
        this.innerTreeData = JSON.parse(JSON.stringify(newVal || []))
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    generateId() {
      return `node-${Date.now()}-${this.idCounter++}`
    },

    syncToParent() {
      this.$emit('input', JSON.parse(JSON.stringify(this.innerTreeData)))
    },

    addRootNode() {
      const newNode = {
        id: this.generateId(),
        label: `${this.defaultNodeLabel}`,
        children: []
      }
      this.innerTreeData.push(newNode)
      this.syncToParent()
    //   this.$message.success('根节点添加成功')
    },

    addChildNode(parentNode) {
      if (!parentNode.children) {
        this.$set(parentNode, 'children', [])
      }
      const newNode = {
        id: this.generateId(),
        label: `${this.defaultNodeLabel}`,
        children: []
      }
      parentNode.children.push(newNode)
      this.syncToParent()
    //   this.$message.success('子节点添加成功')
    },

    addSiblingNode({ parentChildren, index }) {
      const newNode = {
        id: this.generateId(),
        label: `${this.defaultNodeLabel}`,
        children: []
      }
      parentChildren.splice(index + 1, 0, newNode)
      this.syncToParent()
    //   this.$message.success('同级节点添加成功')
    },

    deleteNode({ node, parentChildren, index }) {
      this.$confirm('此操作将永久删除该节点及其所有子节点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        parentChildren.splice(index, 1)
        this.syncToParent()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    updateNodeLabel({ node, newLabel }) {
      node.label = newLabel
      this.syncToParent()
    //   this.$message.success('节点名称更新成功')
    },

    resetTree() {
      this.$confirm('此操作将重置所有节点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.innerTreeData = []
        this.syncToParent()
        this.$message.success('树形结构已重置')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重置'
        })
      })
    },

    getData() {
      return JSON.parse(JSON.stringify(this.innerTreeData))
    },

    setData(data) {
      this.innerTreeData = JSON.parse(JSON.stringify(data || []))
      this.syncToParent()
    }
  }
}
</script>

<style scoped>
.custom-horizontal-tree {
  padding: 0;
  background-color: #fff;
  min-height: auto;
}

.tree-toolbar {
  margin-bottom: 0;
  padding: 10px 15px;
  background-color: #fafafa;
  border-bottom: 1px solid #ebeef5;
}

/* ==================== 整体上下居中核心 ==================== */
.tree-container {
  overflow-x: auto;
  overflow-y: auto;
  padding: 30px;
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

/* 根节点层级：垂直排列 */
.root-level {
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: flex-start;
}

/* ==================== 完美三段式连线算法（100%无缺失） ==================== */
/* 结构：父节点 → 水平线段 → 垂直主线 → 水平线段 → 每个子节点 */

/* 1. 父子节点水平间距 */
::v-deep .tree-children {
  margin-left: 25px;
  position: relative;
}

/* 2. 父节点向右的水平线段：从父节点右侧边缘延伸到垂直主线 */
::v-deep .tree-children::before {
  content: '';
  position: absolute;
  left: -25px; /* 起点：父节点右侧边缘 */
  top: 50%;
  transform: translateY(-50%);
  width: 25px; /* 长度：正好到达垂直主线 */
  height: 2px;
  background-color: #91d5ff;
  z-index: 1;
}

/* 3. 子节点容器：添加左侧内边距，让子节点向右偏移 */
::v-deep .tree-children .tree-level {
  position: relative;
  padding-left: 25px; /* 关键：子节点向右偏移25px，为横向线段预留空间 */
}

/* 4. 垂直主线：连接父节点水平线段和所有子节点水平线段 */
::v-deep .tree-children .tree-level::before {
  content: '';
  position: absolute;
  left: 0; /* 位置：正好在父节点水平线段的右端点 */
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #91d5ff;
  z-index: 1;
}

/* 5. 每个子节点向左的水平线段：从垂直主线延伸到子节点左侧边缘 */
::v-deep .tree-children .tree-node-wrapper::before {
  content: '';
  position: absolute;
  left: -25px; /* 起点：垂直主线位置 */
  top: 50%;
  transform: translateY(-50%);
  width: 25px; /* 长度：正好到达子节点左侧边缘 */
  height: 2px;
  background-color: #91d5ff;
  z-index: 1;
}
</style>