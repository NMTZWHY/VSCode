<!-- src/components/HorizontalTree/TreeNode.vue -->
<template>
  <div class="tree-node-wrapper">
    <!-- 节点内容（左侧） -->
    <div class="tree-node">
      <div class="node-content" :class="{ 'editing': isEditing }">
        <el-input
          v-if="isEditing"
          v-model="editLabel"
          size="mini"
          @blur="saveEdit"
          @keyup.enter.native="saveEdit"
          ref="editInput"
          autofocus
        />
        <span v-else @dblclick="startEdit">{{ node.label }}</span>
      </div>

      <div class="node-actions">
        <el-popover
          placement="bottom"
          width="150"
          trigger="click"
        >
          <el-button 
            type="text" 
            icon="el-icon-plus" 
            size="mini"
            @click="handleAddChild"
          >
            添加子节点
          </el-button>
          <el-button 
            type="text" 
            icon="el-icon-s-operation" 
            size="mini"
            @click="handleAddSibling"
          >
            添加同级节点
          </el-button>
          <el-button 
            type="text" 
            icon="el-icon-edit" 
            size="mini"
            @click="startEdit"
          >
            编辑名称
          </el-button>
          <el-button 
            type="text" 
            icon="el-icon-delete" 
            size="mini"
            style="color: #f56c6c"
            @click="handleDelete"
          >
            删除节点
          </el-button>

          <el-button 
            slot="reference"
            icon="el-icon-more"
            size="mini"
            circle
          />
        </el-popover>
      </div>
    </div>

    <!-- 子节点（右侧，向右展开） -->
    <div v-if="node.children && node.children.length > 0" class="tree-children">
      <div class="tree-level">
        <TreeNode
          v-for="(child, childIndex) in node.children"
          :key="child.id"
          :node="child"
          :level="level + 1"
          :index="childIndex"
          :parent-children="node.children"
          @add-child="$emit('add-child', $event)"
          @add-sibling="$emit('add-sibling', $event)"
          @delete-node="$emit('delete-node', $event)"
          @update-label="$emit('update-label', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TreeNode',
  props: {
    node: {
      type: Object,
      required: true
    },
    level: {
      type: Number,
      default: 0
    },
    index: {
      type: Number,
      default: 0
    },
    parentChildren: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isEditing: false,
      editLabel: ''
    }
  },
  methods: {
    startEdit() {
      this.editLabel = this.node.label
      this.isEditing = true
      this.$nextTick(() => {
        this.$refs.editInput.focus()
      })
    },
    saveEdit() {
      if (this.editLabel.trim() === '') {
        this.$message.warning('节点名称不能为空')
        return
      }
      this.$emit('update-label', {
        node: this.node,
        newLabel: this.editLabel.trim()
      })
      this.isEditing = false
    },
    handleAddChild() {
      this.$emit('add-child', this.node)
    },
    handleAddSibling() {
      this.$emit('add-sibling', {
        parentChildren: this.parentChildren,
        index: this.index
      })
    },
    handleDelete() {
      this.$emit('delete-node', {
        node: this.node,
        parentChildren: this.parentChildren,
        index: this.index
      })
    }
  }
}
</script>

<style scoped>
/* ==================== 纯节点布局样式（无任何连接线） ==================== */
.tree-node-wrapper {
  display: flex;
  flex-direction: row; /* 节点在左，子节点在右 */
  align-items: center; /* 节点与子节点垂直居中对齐 */
}

.tree-node {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: #e6f7ff;
  border: 2px solid #91d5ff; /* 节点边框加粗，与连线粗细一致 */
  border-radius: 6px; /* 增大圆角，更美观 */
  min-width: 120px;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(145, 213, 255, 0.3); /* 蓝色阴影，与主题统一 */
  transition: all 0.3s;
  z-index: 10; /* 节点层级高于连接线 */
  flex-shrink: 0; /* 防止节点被压缩 */
}

.tree-node:hover {
  background-color: #bae7ff;
  box-shadow: 0 4px 12px rgba(145, 213, 255, 0.5);
  transform: translateY(-1px); /* 悬浮轻微上移，增加交互感 */
}

.node-content {
  flex: 1;
  margin-right: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  color: #303133;
}

.node-content.editing {
  margin-right: 0;
}

.node-actions {
  flex-shrink: 0;
}

/* ✅ 同步修改：父节点与子节点的水平间距从35px→25px */
.tree-children {
  margin-left: 25px; /* 与HorizontalTree中的间距完全一致 */
  position: relative;
}

/* 同一父节点的子节点：垂直排列 */
.tree-level {
  display: flex;
  flex-direction: column;
  gap: 30px; /* 同级节点之间的垂直间距（可根据需要调整） */
  align-items: flex-start;
}
</style>