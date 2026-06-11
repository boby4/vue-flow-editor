import type { FlowDocument } from '../types/flow'

export const LAYOUT = {
  originX: 420,
  originY: 80,
  gapY: 150,
  branchGapX: 300,
} as const

export function relayout(doc: FlowDocument): FlowDocument {
  const steps = { ...doc.steps }
  const positions = new Map<string, { x: number; y: number }>()
  const visited = new Set<string>()

  function walk(stepId: string, x: number, y: number): void {
    if (visited.has(stepId)) return
    visited.add(stepId)
    positions.set(stepId, { x, y })

    const thenEdge = doc.edges.find((e) => e.sourceId === stepId && e.sourcePort === 'then')
    const yesEdge = doc.edges.find((e) => e.sourceId === stepId && e.sourcePort === 'yes')
    const noEdge = doc.edges.find((e) => e.sourceId === stepId && e.sourcePort === 'no')

    if (thenEdge) {
      walk(thenEdge.targetId, x, y + LAYOUT.gapY)
    }
    if (yesEdge) {
      walk(yesEdge.targetId, x, y + LAYOUT.gapY)
    }
    if (noEdge) {
      walk(noEdge.targetId, x + LAYOUT.branchGapX, y + LAYOUT.gapY)
    }
  }

  if (doc.rootStepId) {
    walk(doc.rootStepId, LAYOUT.originX, LAYOUT.originY + LAYOUT.gapY)
  }

  Object.keys(steps).forEach((id) => {
    const pos = positions.get(id)
    if (pos) {
      steps[id] = { ...steps[id], position: pos }
    }
  })

  return { ...doc, steps }
}
