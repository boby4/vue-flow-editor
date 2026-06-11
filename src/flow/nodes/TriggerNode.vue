<template>
  <div class="fe-node fe-node--trigger">
    <div class="fe-node__accent" />
    <div class="fe-node__title">When...</div>
    <button
      v-for="t in triggers"
      :key="t.id"
      class="fe-node__item"
      :class="{ 'fe-node__item--active': t.id === selectedTriggerId }"
      type="button"
      @click.stop="onSelectTrigger(t.id)"
    >
      <span class="fe-node__icon">WA</span>
      <span class="fe-node__item-text">{{ t.name }}</span>
    </button>
    <button class="fe-node__add" type="button" @click.stop="onAddTrigger">+ Add new trigger</button>
    <div class="fe-node__port-label">Then</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFlowEditorStore } from '../store/flowEditor'
import type { TriggerItem } from '../types/flow'
import { useX6NodeData } from './useX6NodeData'

const store = useFlowEditorStore()
const nodeData = useX6NodeData<{ triggers?: TriggerItem[] }>()
const triggers = computed<TriggerItem[]>(() => nodeData.value?.triggers ?? [])

const selectedTriggerId = computed(() =>
  store.selected?.kind === 'trigger' ? store.selected.triggerId : null,
)

function onSelectTrigger(triggerId: string) {
  store.selectTrigger(triggerId)
}

function onAddTrigger() {
  store.addTrigger()
}
</script>
