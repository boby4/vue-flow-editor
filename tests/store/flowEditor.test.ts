import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFlowEditorStore } from '@/flow/store/flowEditor'

describe('flowEditorStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('creates default flow with trigger and step-picker', () => {
    const store = useFlowEditorStore()
    store.initNew()
    expect(store.document.triggers).toHaveLength(1)
    expect(Object.values(store.document.steps)).toHaveLength(1)
    expect(Object.values(store.document.steps)[0].type).toBe('step-picker')
  })

  it('replaces step-picker with send-message and appends new picker', () => {
    const store = useFlowEditorStore()
    store.initNew()
    const pickerId = store.document.rootStepId!
    store.pickStepType(pickerId, 'send-message')
    const steps = Object.values(store.document.steps)
    expect(steps.some((s) => s.type === 'send-message')).toBe(true)
    expect(steps.some((s) => s.type === 'step-picker')).toBe(true)
  })

  it('saveDraft writes to localStorage', () => {
    const store = useFlowEditorStore()
    store.initNew()
    store.saveDraft()
    expect(localStorage.getItem(`flow-editor:${store.document.id}`)).toBeTruthy()
  })

  it('publish rejects incomplete flow', () => {
    const store = useFlowEditorStore()
    store.initNew()
    const errors = store.publish()
    expect(errors.length).toBeGreaterThan(0)
  })

  it('updates node position without relayout', () => {
    const store = useFlowEditorStore()
    store.initNew()
    const stepId = store.document.rootStepId!
    store.updateNodePosition(stepId, 100, 200)
    expect(store.document.steps[stepId].position).toEqual({ x: 100, y: 200 })
  })

  it('upsertEdge replaces same source port', () => {
    const store = useFlowEditorStore()
    store.initNew()
    const pickerId = store.document.rootStepId!
    store.upsertEdge({
      id: 'edge-2',
      sourceId: '__trigger__',
      targetId: pickerId,
      sourcePort: 'then',
      targetPort: 'in',
    })
    expect(store.document.edges.filter((e) => e.sourcePort === 'then')).toHaveLength(1)
    expect(store.document.edges[0].id).toBe('edge-2')
  })

  it('adds custom node at requested position', () => {
    const store = useFlowEditorStore()
    store.initNew()
    const id = store.addStep('custom', { x: 100, y: 200 })
    expect(store.document.steps[id].type).toBe('custom')
    expect(store.document.steps[id].position).toEqual({ x: 100, y: 200 })
  })

  it('adds a new whatsapp trigger and selects it', () => {
    const store = useFlowEditorStore()
    store.initNew()
    const id = store.addTrigger()
    expect(store.document.triggers).toHaveLength(2)
    expect(store.document.triggers[1].name).toBe('WhatsApp URL #2')
    expect(store.selected).toEqual({ kind: 'trigger', triggerId: id })
  })

  it('removes step and connected edges', () => {
    const store = useFlowEditorStore()
    store.initNew()
    const pickerId = store.document.rootStepId!
    store.removeStep(pickerId)
    expect(store.document.steps[pickerId]).toBeUndefined()
    expect(store.document.edges.some((e) => e.targetId === pickerId)).toBe(false)
  })
})
