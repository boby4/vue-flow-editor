import type { Graph } from '@antv/x6'
import { DEFAULT_EDGE_ATTRS, SELECTED_EDGE_ATTRS } from './edgeStyles'

type EdgeCell = {
  id: string
  isEdge: () => boolean
  setAttrs: (attrs: typeof DEFAULT_EDGE_ATTRS | typeof SELECTED_EDGE_ATTRS) => void
}

export function clearEdgeSelection(graph: Graph): void {
  graph.getEdges().forEach((edge) => {
    edge.setAttrs({ ...DEFAULT_EDGE_ATTRS })
  })
}

export function selectEdge(graph: Graph, edgeId: string): void {
  clearEdgeSelection(graph)
  const edge = graph.getCellById(edgeId) as EdgeCell | null
  if (edge?.isEdge()) {
    edge.setAttrs({ ...SELECTED_EDGE_ATTRS })
  }
}

export function deleteEdge(graph: Graph, store: { removeEdge: (id: string) => void }, edgeId: string): void {
  clearEdgeSelection(graph)
  store.removeEdge(edgeId)
}
