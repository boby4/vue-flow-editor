<template>
  <aside class="fe-config-panel">
    <TriggerConfigForm
      v-if="selectedTrigger"
      :trigger="selectedTrigger"
      @update="onTriggerUpdate"
    />
    <SendMessageConfigForm
      v-else-if="selectedStep?.type === 'send-message'"
      :config="selectedStep.config as SendMessageConfig"
      @update="onStepUpdate"
      @delete="onDeleteStep"
    />
    <ConditionConfigForm
      v-else-if="selectedStep?.type === 'condition'"
      :config="selectedStep.config as ConditionConfig"
      @update="onStepUpdate"
      @delete="onDeleteStep"
    />
    <CustomConfigForm
      v-else-if="selectedStep?.type === 'custom'"
      :config="selectedStep.config as CustomConfig"
      @update="onCustomUpdate"
      @delete="onDeleteStep"
    />
    <div v-else-if="selectedStep?.type === 'step-picker'" class="fe-config-empty">
      <p>Pick a step type on the canvas to continue building your flow.</p>
      <el-button size="small" type="danger" plain @click="onDeleteStep">Delete picker</el-button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useFlowEditorStore } from '@/flow/store/flowEditor'
import type { ConditionConfig, CustomConfig, SendMessageConfig } from '@/flow/types/flow'
import TriggerConfigForm from './config-forms/TriggerConfigForm.vue'
import SendMessageConfigForm from './config-forms/SendMessageConfigForm.vue'
import ConditionConfigForm from './config-forms/ConditionConfigForm.vue'
import CustomConfigForm from './config-forms/CustomConfigForm.vue'

const store = useFlowEditorStore()

const selectedTrigger = computed(() => {
  const selected = store.selected
  if (!selected || selected.kind !== 'trigger') return null
  return store.document.triggers.find((t) => t.id === selected.triggerId) ?? null
})

const selectedStep = computed(() => {
  const selected = store.selected
  if (!selected || selected.kind !== 'step') return null
  return store.document.steps[selected.stepId] ?? null
})

function onTriggerUpdate(config: { preFilledMessage: string }) {
  if (!selectedTrigger.value) return
  store.updateTriggerConfig(selectedTrigger.value.id, config)
}

function onStepUpdate(config: Partial<SendMessageConfig | ConditionConfig>) {
  if (!selectedStep.value) return
  store.updateStepConfig(selectedStep.value.id, config)
}

function onCustomUpdate(config: CustomConfig) {
  if (!selectedStep.value) return
  store.updateCustomStepConfig(selectedStep.value.id, config)
}

async function onDeleteStep() {
  if (!selectedStep.value) return
  await ElMessageBox.confirm('Delete this node and its connections?', 'Delete node', {
    type: 'warning',
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
  })
  store.removeStep(selectedStep.value.id)
}
</script>

<style scoped>
.fe-config-panel {
  height: 100%;
}

.fe-config-empty {
  padding: 20px;
  color: var(--fe-text-muted);
  font-size: 14px;
  line-height: 1.6;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
