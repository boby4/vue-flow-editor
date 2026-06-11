<template>
  <ConfigPanelHeader :badge="badge" :name="name">
    <template #action>
      <el-button size="small" type="danger" plain @click="$emit('delete')">Delete node</el-button>
    </template>
  </ConfigPanelHeader>
</template>

<script setup lang="ts">
import ConfigPanelHeader from './ConfigPanelHeader.vue'

defineProps<{
  badge: string
  name: string
}>()

defineEmits<{
  delete: []
}>()
</script>
