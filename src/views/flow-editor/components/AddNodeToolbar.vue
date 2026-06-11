<template>
  <div class="fe-add-node">
    <el-dropdown trigger="click" @command="onCommand">
      <el-button type="primary" size="small" class="fe-add-node__btn">+ Add node</el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="opt in ADD_NODE_OPTIONS" :key="opt.type" :command="opt.type">
            <span class="fe-add-node__option">{{ opt.icon }} {{ opt.label }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { ADD_NODE_OPTIONS } from '@/flow/constants/nodeMeta'
import type { AddableStepType } from '@/flow/types/flow'

const emit = defineEmits<{
  add: [type: AddableStepType]
}>()

function onCommand(type: AddableStepType) {
  emit('add', type)
}
</script>

<style scoped>
.fe-add-node {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
}

.fe-add-node__btn {
  --el-button-bg-color: var(--fe-primary);
  --el-button-border-color: var(--fe-primary);
  --el-button-hover-bg-color: var(--fe-primary-hover);
  --el-button-hover-border-color: var(--fe-primary-hover);
  --el-button-text-color: #0f172a;
}

.fe-add-node__option {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
</style>
