<template>
  <div class="fe-page">
    <AppSidebar />
    <div class="fe-main">
      <FlowEditorHeader />
      <div class="fe-workspace">
        <NodeConfigPanel v-if="store.selected" class="fe-panel" />
        <div class="fe-canvas-wrap">
          <div ref="canvasRef" class="fe-canvas" />
          <AddNodeToolbar @add="onAddNode" />
          <EdgeDeleteToolbar v-if="selectedEdgeId" @delete="deleteSelectedEdge" />
          <CanvasToolbar @zoom-in="zoom(0.1)" @zoom-out="zoom(-0.1)" @fit="fitView" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useFlowEditorStore } from '@/flow/store/flowEditor'
import { useFlowGraph } from '@/flow/graph/useFlowGraph'
import AppSidebar from './components/AppSidebar.vue'
import FlowEditorHeader from './components/FlowEditorHeader.vue'
import NodeConfigPanel from './components/NodeConfigPanel.vue'
import CanvasToolbar from './components/CanvasToolbar.vue'
import AddNodeToolbar from './components/AddNodeToolbar.vue'
import EdgeDeleteToolbar from './components/EdgeDeleteToolbar.vue'
import type { AddableStepType } from '@/flow/types/flow'

const route = useRoute()
const store = useFlowEditorStore()
const canvasRef = ref<HTMLElement | null>(null)
const { zoom, fitView, selectedEdgeId, deleteSelectedEdge, addNode } = useFlowGraph(canvasRef)

function onAddNode(type: AddableStepType) {
  addNode(type)
}

onMounted(() => {
  const id = route.params.id as string | undefined
  if (id) {
    store.load(id)
  } else {
    store.initNew()
  }
  setTimeout(() => fitView(), 150)
})
</script>
