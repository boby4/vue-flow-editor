<template>
  <div class="fe-form">
    <StepConfigHeader
      badge="Custom"
      :name="form.title || 'Custom node'"
      @delete="$emit('delete')"
    />
    <el-form label-position="top">
      <el-form-item label="Icon">
        <el-input v-model="form.icon" maxlength="4" placeholder="e.g. ⭐" @input="emitUpdate" />
      </el-form-item>
      <el-form-item label="Title">
        <el-input v-model="form.title" placeholder="Node title" @input="emitUpdate" />
      </el-form-item>
      <el-form-item label="Description">
        <el-input
          v-model="form.description"
          placeholder="Short description shown on node"
          @input="emitUpdate"
        />
      </el-form-item>
      <el-form-item label="Content">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="8"
          placeholder="Custom node body content"
          @input="emitUpdate"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { CustomConfig } from '@/flow/types/flow'
import StepConfigHeader from './StepConfigHeader.vue'

const props = defineProps<{
  config: CustomConfig
}>()

const emit = defineEmits<{
  update: [config: CustomConfig]
  delete: []
}>()

const form = reactive<CustomConfig>({
  icon: props.config.icon,
  title: props.config.title,
  description: props.config.description,
  content: props.config.content,
})

watch(
  () => props.config,
  (config) => {
    form.icon = config.icon
    form.title = config.title
    form.description = config.description
    form.content = config.content
  },
  { deep: true },
)

function emitUpdate() {
  emit('update', {
    icon: form.icon,
    title: form.title,
    description: form.description,
    content: form.content,
  })
}
</script>

<style scoped>
.fe-form {
  padding: 20px;
}
</style>
