import type { Graph } from '@antv/x6'
import type { useFlowEditorStore } from '../store/flowEditor'
import { clearEdgeSelection, deleteEdge, selectEdge } from './edgeSelection'
import { isGraphRebuilding } from './graphRebuildGuard'
import { TRIGGER_VIRTUAL_ID, type SourcePort } from '../types/flow'

type FlowEditorStore = ReturnType<typeof useFlowEditorStore>

export interface GraphEventCallbacks {
  onEdgeSelect: (edgeId: string) => void
  onEdgeDeselect: () => void
}

export function bindGraphEvents(
  graph: Graph,
  store: FlowEditorStore,
  callbacks: GraphEventCallbacks,
): () => void {
  let selectedEdgeId: string | null = null

  const deselectEdge = () => {
    if (!selectedEdgeId) return
    selectedEdgeId = null
    clearEdgeSelection(graph)
    callbacks.onEdgeDeselect()
  }

  const onNodeMoved = ({ node }: { node: { id: string; position: () => { x: number; y: number } } }) => {
    const { x, y } = node.position()
    if (node.id === TRIGGER_VIRTUAL_ID) {
      store.updateTriggerPosition(x, y)
    } else {
      store.updateNodePosition(node.id, x, y)
    }
  }

  const onEdgeConnected = ({
    isNew,
    edge,
  }: {
    isNew?: boolean
    edge: {
      id: string
      getSource: () => { cell?: string; port?: string }
      getTarget: () => { cell?: string; port?: string }
    }
  }) => {
    if (!isNew) return

    const source = edge.getSource()
    const target = edge.getTarget()
    if (!source.cell || !target.cell) return

    store.upsertEdge({
      id: edge.id,
      sourceId: String(source.cell),
      targetId: String(target.cell),
      sourcePort: (source.port || 'then') as SourcePort,
      targetPort: 'in',
    })
  }

  const onEdgeRemoved = ({ edge }: { edge: { id: string } }) => {
    if (isGraphRebuilding()) return
    if (edge.id === selectedEdgeId) {
      deselectEdge()
    }
    store.removeEdge(edge.id)
  }

  const onEdgeClick = ({ edge }: { edge: { id: string } }) => {
    selectedEdgeId = edge.id
    selectEdge(graph, edge.id)
    callbacks.onEdgeSelect(edge.id)
  }

  const onNodeClick = () => {
    deselectEdge()
  }

  const onBlankClick = () => {
    deselectEdge()
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (!selectedEdgeId) return
    if (event.key !== 'Delete' && event.key !== 'Backspace') return
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return
    }

    event.preventDefault()
    const edgeId = selectedEdgeId
    deselectEdge()
    deleteEdge(graph, store, edgeId)
  }

  graph.on('node:moved', onNodeMoved)
  graph.on('edge:connected', onEdgeConnected)
  graph.on('edge:removed', onEdgeRemoved)
  graph.on('edge:click', onEdgeClick)
  graph.on('node:click', onNodeClick)
  graph.on('blank:click', onBlankClick)
  window.addEventListener('keydown', onKeyDown)

  return () => {
    graph.off('node:moved', onNodeMoved)
    graph.off('edge:connected', onEdgeConnected)
    graph.off('edge:removed', onEdgeRemoved)
    graph.off('edge:click', onEdgeClick)
    graph.off('node:click', onNodeClick)
    graph.off('blank:click', onBlankClick)
    window.removeEventListener('keydown', onKeyDown)
  }
}
