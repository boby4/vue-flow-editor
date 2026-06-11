import type { Graph } from '@antv/x6'
import { computeTriggerNodeHeight, NODE_SIZE } from '../constants/nodeMeta'
import { DEFAULT_EDGE_ATTRS } from './edgeStyles'
import { runGraphRebuild } from './graphRebuildGuard'
import { TRIGGER_VIRTUAL_ID, type FlowDocument, type StepType } from '../types/flow'

const SHAPE_MAP: Record<StepType, string> = {
  'step-picker': 'node-step-picker',
  'send-message': 'node-send-message',
  condition: 'node-condition',
  custom: 'node-custom',
}

export function rebuildGraph(graph: Graph, doc: FlowDocument): void {
  const cells: Record<string, unknown>[] = [
    {
      id: TRIGGER_VIRTUAL_ID,
      shape: 'node-trigger',
      width: NODE_SIZE.trigger.width,
      height: computeTriggerNodeHeight(doc.triggers.length),
      x: doc.triggerPosition.x,
      y: doc.triggerPosition.y,
      data: {
        kind: 'trigger',
        refId: doc.triggers[0]?.id,
        triggers: doc.triggers,
      },
    },
  ]

  Object.values(doc.steps).forEach((step) => {
    cells.push({
      id: step.id,
      shape: SHAPE_MAP[step.type],
      x: step.position.x,
      y: step.position.y,
      data: {
        kind: 'step',
        refId: step.id,
        step,
      },
    })
  })

  doc.edges.forEach((edge) => {
    cells.push({
      id: edge.id,
      shape: 'edge',
      source: { cell: edge.sourceId, port: edge.sourcePort },
      target: { cell: edge.targetId, port: edge.targetPort },
      connector: { name: 'smooth' },
      attrs: { ...DEFAULT_EDGE_ATTRS },
    })
  })

  runGraphRebuild(() => {
    graph.fromJSON({ cells })
  })
}

export function patchGraphData(graph: Graph, doc: FlowDocument): void {
  const triggerNode = graph.getCellById(TRIGGER_VIRTUAL_ID)
  if (triggerNode?.isNode()) {
    const height = computeTriggerNodeHeight(doc.triggers.length)
    triggerNode.resize(NODE_SIZE.trigger.width, height)
    triggerNode.setData(
      {
        kind: 'trigger',
        refId: doc.triggers[0]?.id,
        triggers: doc.triggers.map((t) => ({ ...t, config: { ...t.config } })),
      },
      { overwrite: true },
    )
  }

  Object.values(doc.steps).forEach((step) => {
    const cell = graph.getCellById(step.id)
    if (cell?.isNode()) {
      cell.setData(
        {
          kind: 'step',
          refId: step.id,
          step: { ...step, config: { ...step.config } },
        },
        { overwrite: true },
      )
    }
  })
}

/** @deprecated use rebuildGraph */
export function syncGraph(graph: Graph, doc: FlowDocument): void {
  rebuildGraph(graph, doc)
}
