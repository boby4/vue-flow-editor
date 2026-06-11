<template>
  <div class="fe-edge-toolbar">
    <span class="fe-edge-toolbar__label">已选中连线</span>
    <el-button size="small" type="danger" plain @click="$emit('delete')">删除连线</el-button>
    <span class="fe-edge-toolbar__hint">或按 Delete</span>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  delete: []
}>()
</script>

<style scoped>
.fe-edge-toolbar {
  position: absolute;
  left: 50%;
  bottom: 72px;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  background: #fff;
  border: 1px solid var(--fe-border);
  border-radius: 10px;
  box-shadow: var(--fe-node-shadow);
  z-index: 10;
}

.fe-edge-toolbar__label {
  font-size: 13px;
  color: var(--fe-text);
}

.fe-edge-toolbar__hint {
  font-size: 12px;
  color: var(--fe-text-muted);
}
</style>
