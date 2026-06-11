<template>
  <div class="fe-panel-header">
    <div class="fe-panel-header__info">
      <span class="fe-panel-header__badge">{{ badge }}</span>
      <span class="fe-panel-header__name">{{ name }}</span>
    </div>
    <div v-if="$slots.action" class="fe-panel-header__action">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  badge: string
  name: string
}>()
</script>

<style scoped>
.fe-panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--fe-border);
}

.fe-panel-header__info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  flex: 1;
}

.fe-panel-header__badge {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--fe-text-muted);
}

.fe-panel-header__name {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.35;
  word-break: break-word;
  color: var(--fe-text);
}

.fe-panel-header__action {
  flex-shrink: 0;
}
</style>
