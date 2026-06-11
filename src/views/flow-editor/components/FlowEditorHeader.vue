<template>
  <header class="fe-header">
    <div class="fe-header__left">
      <button class="fe-header__back" type="button" @click="goBack">←</button>
      <el-tag size="small" type="info">{{ statusLabel }}</el-tag>
      <el-input
        v-model="title"
        class="fe-header__title"
        size="small"
        @change="onTitleChange"
      />
      <span class="fe-header__meta">Updated {{ updatedLabel }}</span>
      <span class="fe-header__meta">{{ store.document.channelName }}</span>
    </div>
    <div class="fe-header__right">
      <el-button size="small" @click="onSave">Save as draft</el-button>
      <el-button size="small" type="primary" class="fe-header__publish" @click="onPublish">
        Publish
      </el-button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useFlowEditorStore } from '@/flow/store/flowEditor'

const router = useRouter()
const store = useFlowEditorStore()
const title = ref(store.document.title)

watch(
  () => store.document.title,
  (value) => {
    title.value = value
  },
)

const statusLabel = computed(() => (store.document.status === 'published' ? 'Published' : 'Draft'))
const updatedLabel = computed(() => {
  const date = new Date(store.document.updatedAt)
  return date.toLocaleString()
})

function onTitleChange() {
  store.updateTitle(title.value.trim() || 'Untitled')
}

function onSave() {
  store.saveDraft()
  router.replace(`/flows/${store.document.id}`)
  ElMessage.success('Draft saved')
}

function onPublish() {
  const errors = store.publish()
  if (errors.length) {
    ElMessage.error(errors.join('；'))
    return
  }
  ElMessage.success('Published successfully')
}

function goBack() {
  router.push('/flows')
}
</script>

<style scoped>
.fe-header {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid var(--fe-border);
}

.fe-header__left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.fe-header__back {
  width: 32px;
  height: 32px;
  border: 1px solid var(--fe-border);
  border-radius: 8px;
  background: #fff;
}

.fe-header__title {
  width: 180px;
}

.fe-header__meta {
  font-size: 12px;
  color: var(--fe-text-muted);
  white-space: nowrap;
}

.fe-header__right {
  display: flex;
  gap: 8px;
}

.fe-header__publish {
  --el-button-bg-color: var(--fe-primary);
  --el-button-border-color: var(--fe-primary);
  --el-button-hover-bg-color: var(--fe-primary-hover);
  --el-button-hover-border-color: var(--fe-primary-hover);
  --el-button-text-color: #0f172a;
}
</style>
