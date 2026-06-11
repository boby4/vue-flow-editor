<template>
  <div class="fe-node fe-node--step fe-node--custom">
    <div class="fe-node__step-icon">{{ icon }}</div>
    <div class="fe-node__step-body">
      <div class="fe-node__step-title">{{ title }}</div>
      <div v-if="description" class="fe-node__step-desc">{{ description }}</div>
      <div class="fe-node__step-summary">{{ summary }}</div>
    </div>
    <div class="fe-node__port-label fe-node__port-label--right">Then</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CustomConfig, FlowStep } from '../types/flow'
import { useX6NodeData } from './useX6NodeData'

const nodeData = useX6NodeData<{ step?: FlowStep }>()

const config = computed(() => nodeData.value?.step?.config as CustomConfig | undefined)
const icon = computed(() => config.value?.icon?.trim() || '⭐')
const title = computed(() => config.value?.title?.trim() || 'Custom node')
const description = computed(() => config.value?.description?.trim() ?? '')

const summary = computed(() => {
  const text = config.value?.content?.trim()
  return text ? text.slice(0, 48) + (text.length > 48 ? '…' : '') : 'Click to edit content'
})
</script>

<style scoped>
.fe-node__step-desc {
  font-size: 11px;
  color: var(--fe-text-muted);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
