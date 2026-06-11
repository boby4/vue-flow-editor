import type { FlowDocument } from '../types/flow'

/** 不含坐标，仅描述节点类型与连线拓扑 */
export function structuralSignature(doc: FlowDocument): string {
  const steps = Object.values(doc.steps)
    .map((s) => `${s.id}:${s.type}`)
    .sort()
    .join('|')

  const edges = doc.edges
    .map((e) => `${e.sourceId}:${e.sourcePort}->${e.targetId}`)
    .sort()
    .join('|')

  const triggers = doc.triggers.map((t) => t.id).sort().join('|')

  return `${triggers}#${steps}#${edges}`
}
