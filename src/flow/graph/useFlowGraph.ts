import { onBeforeUnmount, onMounted, ref, shallowRef, watch, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { Graph } from '@antv/x6'
import { bindGraphEvents } from './bindGraphEvents'
import { deleteEdge } from './edgeSelection'
import { structuralSignature } from './graphSignature'
import { createGraph } from './registerNodes'
import { patchGraphData, rebuildGraph } from './syncGraph'
import { useFlowEditorStore } from '../store/flowEditor'
import type { AddableStepType } from '../types/flow'

export function useFlowGraph(containerRef: Ref<HTMLElement | null>) {
  const graphRef = shallowRef<Graph | null>(null)
  const isDragging = ref(false)
  const selectedEdgeId = ref<string | null>(null)
  const store = useFlowEditorStore()
  const { document } = storeToRefs(store)
  let unbindGraphEvents: (() => void) | null = null

  onMounted(() => {
    if (!containerRef.value) return

    const graph = createGraph(containerRef.value, (refId, kind) => {
      if (kind === 'trigger') {
        store.selectTrigger(refId)
      } else {
        store.selectStep(refId)
      }
    })

    graph.on('node:move', () => {
      isDragging.value = true
    })
    graph.on('node:moved', () => {
      isDragging.value = false
    })

    graphRef.value = graph
    unbindGraphEvents = bindGraphEvents(graph, store, {
      onEdgeSelect: (edgeId) => {
        selectedEdgeId.value = edgeId
      },
      onEdgeDeselect: () => {
        selectedEdgeId.value = null
      },
    })
    rebuildGraph(graph, document.value)
  })

  watch(
    () => structuralSignature(document.value),
    () => {
      selectedEdgeId.value = null
      if (isDragging.value) return
      const graph = graphRef.value
      if (graph) {
        rebuildGraph(graph, document.value)
      }
    },
  )

  watch(
    () => ({
      triggers: document.value.triggers,
      steps: Object.values(document.value.steps).map((s) => ({
        id: s.id,
        label: s.label,
        config: s.config,
      })),
    }),
    () => {
      if (isDragging.value) return
      const graph = graphRef.value
      if (graph) {
        patchGraphData(graph, document.value)
      }
    },
    { deep: true },
  )

  onBeforeUnmount(() => {
    unbindGraphEvents?.()
    graphRef.value?.dispose()
  })

  function zoom(delta: number) {
    if (!graphRef.value) return
    graphRef.value.zoom(delta, { absolute: false })
  }

  function fitView() {
    graphRef.value?.zoomToFit({ padding: 40, maxScale: 1 })
  }

  function deleteSelectedEdge() {
    const graph = graphRef.value
    const edgeId = selectedEdgeId.value
    if (!graph || !edgeId) return
    selectedEdgeId.value = null
    deleteEdge(graph, store, edgeId)
  }

  function addNode(type: AddableStepType) {
    const graph = graphRef.value
    if (!graph) {
      store.addStep(type)
      return
    }

    const container = graph.container as HTMLElement
    const { width, height } = container.getBoundingClientRect()
    const point = graph.clientToLocal(width / 2, height / 2)
    const offset = Object.keys(store.document.steps).length * 24

    store.addStep(type, {
      x: point.x + offset,
      y: point.y + offset,
    })
  }

  return { graphRef, zoom, fitView, isDragging, selectedEdgeId, deleteSelectedEdge, addNode }
}
