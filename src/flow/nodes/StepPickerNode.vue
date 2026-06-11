<template>
  <div class="fe-node fe-node--picker">
    <div class="fe-node__title">{{ title }}</div>
    <div class="fe-picker-group">
      <div class="fe-picker-group__label">Content</div>
      <div class="fe-picker-grid">
        <button
          v-for="opt in contentOptions"
          :key="opt.type"
          class="fe-picker-item"
          type="button"
          @click.stop="onPick(opt.type)"
        >
          <span class="fe-picker-item__icon">{{ opt.icon }}</span>
          {{ opt.label }}
        </button>
      </div>
    </div>
    <div class="fe-picker-group">
      <div class="fe-picker-group__label">Logic</div>
      <div class="fe-picker-grid">
        <button
          v-for="opt in logicOptions"
          :key="opt.type"
          class="fe-picker-item"
          type="button"
          @click.stop="onPick(opt.type)"
        >
          <span class="fe-picker-item__icon">{{ opt.icon }}</span>
          {{ opt.label }}
        </button>
      </div>
    </div>
    <div class="fe-picker-group">
      <div class="fe-picker-group__label">Custom</div>
      <div class="fe-picker-grid">
        <button
          v-for="opt in customOptions"
          :key="opt.type"
          class="fe-picker-item"
          type="button"
          @click.stop="onPick(opt.type)"
        >
          <span class="fe-picker-item__icon">{{ opt.icon }}</span>
          {{ opt.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import type { Node } from '@antv/x6'
import { PICKER_OPTIONS } from '../constants/nodeMeta'
import { useFlowEditorStore } from '../store/flowEditor'
import type { AddableStepType } from '../types/flow'

const getNode = inject<() => Node>('getNode')
const store = useFlowEditorStore()

const stepId = computed(() => getNode?.().getData()?.refId as string)
const title = computed(() => getNode?.().getData()?.step?.label ?? 'Choose first step')
const contentOptions = PICKER_OPTIONS.filter((o) => o.group === 'content')
const logicOptions = PICKER_OPTIONS.filter((o) => o.group === 'logic')
const customOptions = PICKER_OPTIONS.filter((o) => o.group === 'custom')

function onPick(type: AddableStepType) {
  store.pickStepType(stepId.value, type)
}
</script>
