<template>
  <div class="fe-form">
    <StepConfigHeader badge="Logic" name="Condition" @delete="$emit('delete')" />
    <el-form label-position="top">
      <el-form-item label="Field">
        <el-input v-model="field" placeholder="e.g. tag" @change="emitUpdate" />
      </el-form-item>
      <el-form-item label="Operator">
        <el-select v-model="operator" style="width: 100%" @change="emitUpdate">
          <el-option label="Equals" value="equals" />
          <el-option label="Contains" value="contains" />
          <el-option label="Exists" value="exists" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="operator !== 'exists'" label="Value">
        <el-input v-model="value" placeholder="Comparison value" @change="emitUpdate" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ConditionConfig } from '@/flow/types/flow'
import StepConfigHeader from './StepConfigHeader.vue'

const props = defineProps<{
  config: ConditionConfig
}>()

const emit = defineEmits<{
  update: [config: Partial<ConditionConfig>]
  delete: []
}>()

const field = ref(props.config.field)
const operator = ref(props.config.operator)
const value = ref(props.config.value)

watch(
  () => props.config,
  (config) => {
    field.value = config.field
    operator.value = config.operator
    value.value = config.value
  },
  { deep: true },
)

function emitUpdate() {
  emit('update', {
    field: field.value,
    operator: operator.value,
    value: value.value,
  })
}
</script>

<style scoped>
.fe-form {
  padding: 20px;
}
</style>
