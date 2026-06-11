<template>
  <div class="fe-form">
    <StepConfigHeader badge="Content" name="Send message" @delete="$emit('delete')" />
    <el-form label-position="top">
      <el-form-item label="Message text">
        <el-input
          v-model="text"
          type="textarea"
          :rows="6"
          placeholder="Type the message to send"
          @change="emitUpdate"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { SendMessageConfig } from '@/flow/types/flow'
import StepConfigHeader from './StepConfigHeader.vue'

const props = defineProps<{
  config: SendMessageConfig
}>()

const emit = defineEmits<{
  update: [config: Partial<SendMessageConfig>]
  delete: []
}>()

const text = ref(props.config.text)

watch(
  () => props.config.text,
  (value) => {
    text.value = value
  },
)

function emitUpdate() {
  emit('update', { text: text.value })
}
</script>

<style scoped>
.fe-form {
  padding: 20px;
}
</style>
