import { describe, it, expect } from 'vitest'
import { createEmptyFlow } from '@/flow/types/flow'
import { structuralSignature } from '@/flow/graph/graphSignature'

describe('structuralSignature', () => {
  it('does not change when only position updates', () => {
    const doc = createEmptyFlow()
    const before = structuralSignature(doc)
    doc.triggerPosition = { x: 999, y: 888 }
    const pickerId = doc.rootStepId!
    doc.steps[pickerId].position = { x: 100, y: 200 }
    expect(structuralSignature(doc)).toBe(before)
  })

  it('changes when step type changes', () => {
    const doc = createEmptyFlow()
    const before = structuralSignature(doc)
    const pickerId = doc.rootStepId!
    doc.steps[pickerId].type = 'send-message'
    expect(structuralSignature(doc)).not.toBe(before)
  })
})
