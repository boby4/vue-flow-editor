import type { FlowDocument, SourcePort } from '../types/flow'
import { TRIGGER_VIRTUAL_ID } from '../types/flow'
import { LAYOUT } from './autoLayout'

export function getNodePosition(doc: FlowDocument, nodeId: string): { x: number; y: number } {
  if (nodeId === TRIGGER_VIRTUAL_ID) {
    return doc.triggerPosition
  }
  return doc.steps[nodeId]?.position ?? { x: LAYOUT.originX, y: LAYOUT.originY }
}

export function positionNewStep(
  doc: FlowDocument,
  sourceId: string,
  sourcePort: SourcePort,
  newStepId: string,
): void {
  const step = doc.steps[newStepId]
  if (!step) return

  const sourcePos = getNodePosition(doc, sourceId)
  let x = sourcePos.x
  if (sourcePort === 'no') {
    x += LAYOUT.branchGapX
  }

  step.position = {
    x,
    y: sourcePos.y + LAYOUT.gapY,
  }
}
