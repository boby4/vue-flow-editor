<template>
  <div class="fe-toolbar">
    <button type="button" title="Zoom out" @click="$emit('zoom-out')">−</button>
    <button type="button" title="Fit view" @click="$emit('fit')">□</button>
    <button type="button" title="Zoom in" @click="$emit('zoom-in')">+</button>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  'zoom-in': []
  'zoom-out': []
  fit: []
}>()
</script>

<style scoped>
.fe-toolbar {
  position: absolute;
  right: 20px;
  bottom: 20px;
  display: flex;
  gap: 4px;
  padding: 4px;
  background: #fff;
  border: 1px solid var(--fe-border);
  border-radius: 10px;
  box-shadow: var(--fe-node-shadow);
}

.fe-toolbar button {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: #fff;
  font-size: 16px;
}

.fe-toolbar button:hover {
  background: #f1f5f9;
}
</style>
