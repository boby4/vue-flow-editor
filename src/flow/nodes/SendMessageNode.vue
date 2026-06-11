<template>
  <div class="fe-node fe-node--step">
    <div class="fe-node__step-icon">💬</div>
    <div class="fe-node__step-body">
      <div class="fe-node__step-title">Send message</div>
      <div class="fe-node__step-summary">{{ summary }}</div>
    </div>
    <div class="fe-node__port-label fe-node__port-label--right">Then</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FlowStep, SendMessageConfig } from '../types/flow'
import { useX6NodeData } from './useX6NodeData'

const nodeData = useX6NodeData<{ step?: FlowStep }>()

const summary = computed(() => {
  const config = nodeData.value?.step?.config as SendMessageConfig | undefined
  const text = config?.text?.trim()
  return text ? text.slice(0, 40) + (text.length > 40 ? '…' : '') : 'No message yet'
})
</script>
