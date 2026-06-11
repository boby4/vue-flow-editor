<template>
  <div class="fe-node fe-node--step fe-node--condition">
    <div class="fe-node__step-icon">⑂</div>
    <div class="fe-node__step-body">
      <div class="fe-node__step-title">Condition</div>
      <div class="fe-node__step-summary">{{ summary }}</div>
    </div>
    <div class="fe-node__branch-labels">
      <span>Yes</span>
      <span>No</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ConditionConfig, FlowStep } from '../types/flow'
import { useX6NodeData } from './useX6NodeData'

const nodeData = useX6NodeData<{ step?: FlowStep }>()

const summary = computed(() => {
  const config = nodeData.value?.step?.config as ConditionConfig | undefined
  if (!config?.field) return 'Set condition'
  if (config.operator === 'exists') return `${config.field} exists`
  return `${config.field} ${config.operator} ${config.value || '…'}`
})
</script>
