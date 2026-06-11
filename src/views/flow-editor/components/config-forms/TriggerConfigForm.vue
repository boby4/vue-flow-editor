<template>
  <div class="fe-config-form">
    <ConfigPanelHeader badge="Trigger" :name="trigger.name" />
    <el-form label-position="top">
      <el-form-item label="Pre-filled message">
        <el-input
          v-model="message"
          type="textarea"
          :rows="4"
          placeholder="Enter a pre-filled message for WhatsApp URL"
          @change="emitUpdate"
        />
        <div class="fe-config-form__hint">
          This message will be pre-filled when users open your WhatsApp link.
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TriggerItem } from '@/flow/types/flow'
import ConfigPanelHeader from './ConfigPanelHeader.vue'

const props = defineProps<{
  trigger: TriggerItem
}>()

const emit = defineEmits<{
  update: [config: { preFilledMessage: string }]
}>()

const message = ref(props.trigger.config.preFilledMessage)

watch(
  () => props.trigger.config.preFilledMessage,
  (value) => {
    message.value = value
  },
)

function emitUpdate() {
  emit('update', { preFilledMessage: message.value })
}
</script>

<style scoped>
.fe-config-form {
  padding: 20px;
}

.fe-config-form__hint {
  margin-top: 8px;
  font-size: 12px;
  color: var(--fe-text-muted);
  line-height: 1.6;
}
</style>
