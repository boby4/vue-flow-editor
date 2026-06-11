import { describe, it, expect } from 'vitest'
import { relayout } from '@/flow/layout/autoLayout'
import { createEmptyFlow, TRIGGER_VIRTUAL_ID } from '@/flow/types/flow'

describe('relayout', () => {
  it('places trigger and picker vertically', () => {
    const doc = relayout(createEmptyFlow())
    const picker = Object.values(doc.steps)[0]
    expect(picker.position.y).toBeGreaterThan(200)
    expect(picker.position.x).toBe(420)
  })

  it('offsets no-branch to the right for condition', () => {
    const doc = createEmptyFlow()
    const pickerId = doc.rootStepId!
    const condId = 'cond-1'
    const yesPicker = 'yes-picker'
    const noPicker = 'no-picker'

    doc.steps[condId] = {
      id: condId,
      type: 'condition',
      label: 'Condition',
      config: { field: 'tag', operator: 'exists', value: '' },
      position: { x: 0, y: 0 },
    }
    doc.steps[yesPicker] = {
      id: yesPicker,
      type: 'step-picker',
      label: 'Choose',
      config: {},
      position: { x: 0, y: 0 },
    }
    doc.steps[noPicker] = {
      id: noPicker,
      type: 'step-picker',
      label: 'Choose',
      config: {},
      position: { x: 0, y: 0 },
    }
    delete doc.steps[pickerId]

    doc.edges = [
      { id: 'e1', sourceId: TRIGGER_VIRTUAL_ID, targetId: condId, sourcePort: 'then', targetPort: 'in' },
      { id: 'e2', sourceId: condId, targetId: yesPicker, sourcePort: 'yes', targetPort: 'in' },
      { id: 'e3', sourceId: condId, targetId: noPicker, sourcePort: 'no', targetPort: 'in' },
    ]
    doc.triggerPosition = { x: 420, y: 80 }
    doc.rootStepId = condId

    const laid = relayout(doc)
    expect(laid.steps[noPicker].position.x).toBeGreaterThan(laid.steps[yesPicker].position.x)
  })
})
