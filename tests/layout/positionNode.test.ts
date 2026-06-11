import { describe, it, expect } from 'vitest'
import { createEmptyFlow } from '@/flow/types/flow'
import { getNodePosition, positionNewStep } from '@/flow/layout/positionNode'

describe('positionNewStep', () => {
  it('places new step below source on same x', () => {
    const doc = createEmptyFlow()
    const sourceId = doc.rootStepId!
    const newId = 'new-step'

    doc.steps[newId] = {
      id: newId,
      type: 'step-picker',
      label: 'Choose',
      config: {},
      position: { x: 0, y: 0 },
    }

    positionNewStep(doc, sourceId, 'then', newId)

    expect(doc.steps[newId].position.y).toBeGreaterThan(doc.steps[sourceId].position.y)
    expect(doc.steps[newId].position.x).toBe(doc.steps[sourceId].position.x)
  })

  it('offsets no branch to the right', () => {
    const doc = createEmptyFlow()
    doc.steps['cond'] = {
      id: 'cond',
      type: 'condition',
      label: 'Condition',
      config: { field: 'tag', operator: 'exists', value: '' },
      position: { x: 420, y: 380 },
    }
    const newId = 'no-picker'
    doc.steps[newId] = {
      id: newId,
      type: 'step-picker',
      label: 'Choose',
      config: {},
      position: { x: 0, y: 0 },
    }

    positionNewStep(doc, 'cond', 'no', newId)

    expect(doc.steps[newId].position.x).toBeGreaterThan(getNodePosition(doc, 'cond').x)
  })
})
