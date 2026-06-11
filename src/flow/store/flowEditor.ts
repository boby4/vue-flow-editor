import { defineStore } from 'pinia'
import { saveDraft as persistDraft, loadFlow, publishFlow } from '@/api/flowStorage'
import { createDefaultStepConfig } from '../constants/nodeMeta'
import { LAYOUT } from '../layout/autoLayout'
import { positionNewStep } from '../layout/positionNode'
import { validateForPublish } from '../validation'
import {
  createEmptyFlow,
  type AddableStepType,
  type ConditionConfig,
  type CustomConfig,
  type FlowDocument,
  type FlowEdge,
  type SelectableTarget,
  type SendMessageConfig,
  type SourcePort,
  type TriggerItem,
} from '../types/flow'

function normalizeDocument(doc: FlowDocument): FlowDocument {
  if (!doc.triggerPosition) {
    doc.triggerPosition = { x: LAYOUT.originX, y: LAYOUT.originY }
  }

  doc.edges = doc.edges.map((edge) => ({
    ...edge,
    targetPort: edge.targetPort ?? 'in',
  }))

  Object.values(doc.steps).forEach((step) => {
    if (step.type === 'custom') {
      const config = step.config as CustomConfig
      if (!config.title) {
        config.title = step.label || 'Custom node'
      }
      if (!config.icon) {
        config.icon = '⭐'
      }
    }
  })

  return doc
}

function defaultAddPosition(doc: FlowDocument): { x: number; y: number } {
  const count = Object.keys(doc.steps).length
  return {
    x: LAYOUT.originX + (count % 4) * 40,
    y: LAYOUT.originY + LAYOUT.gapY + (count % 6) * 40,
  }
}

export const useFlowEditorStore = defineStore('flowEditor', {
  state: () => ({
    document: createEmptyFlow() as FlowDocument,
    selected: null as SelectableTarget | null,
    isDirty: false,
  }),

  actions: {
    initNew() {
      const doc = normalizeDocument(createEmptyFlow())
      const pickerId = doc.rootStepId!
      doc.steps[pickerId].position = {
        x: doc.triggerPosition.x,
        y: doc.triggerPosition.y + LAYOUT.gapY,
      }
      this.document = doc
      this.selected = { kind: 'trigger', triggerId: this.document.triggers[0].id }
      this.isDirty = false
    },

    load(id: string) {
      const doc = loadFlow(id)
      if (!doc) {
        this.initNew()
        return
      }
      this.document = normalizeDocument(doc)
      this.selected = { kind: 'trigger', triggerId: this.document.triggers[0].id }
      this.isDirty = false
    },

    selectTrigger(triggerId: string) {
      this.selected = { kind: 'trigger', triggerId }
    },

    selectStep(stepId: string) {
      this.selected = { kind: 'step', stepId }
    },

    updateTitle(title: string) {
      this.document.title = title
      this.isDirty = true
    },

    updateTriggerPosition(x: number, y: number) {
      this.document.triggerPosition = { x, y }
      this.isDirty = true
    },

    updateNodePosition(stepId: string, x: number, y: number) {
      const step = this.document.steps[stepId]
      if (!step) return
      step.position = { x, y }
      this.isDirty = true
    },

    updateTriggerConfig(triggerId: string, config: { preFilledMessage: string }) {
      const trigger = this.document.triggers.find((t) => t.id === triggerId)
      if (!trigger) return
      trigger.config = { ...trigger.config, ...config }
      this.isDirty = true
    },

    addTrigger(): string {
      const id = crypto.randomUUID()
      const trigger: TriggerItem = {
        id,
        type: 'whatsapp-url',
        name: `WhatsApp URL #${this.document.triggers.length + 1}`,
        config: { preFilledMessage: '' },
      }
      this.document.triggers.push(trigger)
      this.selected = { kind: 'trigger', triggerId: id }
      this.isDirty = true
      return id
    },

    updateStepConfig(stepId: string, config: Partial<SendMessageConfig | ConditionConfig>) {
      const step = this.document.steps[stepId]
      if (!step || step.type === 'step-picker' || step.type === 'custom') return
      if (step.type === 'send-message') {
        step.config = { ...step.config, ...config } as SendMessageConfig
      } else {
        step.config = { ...step.config, ...config } as ConditionConfig
      }
      this.isDirty = true
    },

    updateCustomStepConfig(stepId: string, config: CustomConfig) {
      const step = this.document.steps[stepId]
      if (!step || step.type !== 'custom') return
      step.config = { ...config }
      step.label = config.title.trim() || 'Custom node'
      this.isDirty = true
    },

    addStep(type: AddableStepType, position?: { x: number; y: number }): string {
      const id = crypto.randomUUID()
      const { label, config } = createDefaultStepConfig(type)
      this.document.steps[id] = {
        id,
        type,
        label,
        config,
        position: position ?? defaultAddPosition(this.document),
      }
      this.selected = { kind: 'step', stepId: id }
      this.isDirty = true
      return id
    },

    removeStep(stepId: string) {
      if (!this.document.steps[stepId]) return
      delete this.document.steps[stepId]
      this.document.edges = this.document.edges.filter(
        (edge) => edge.sourceId !== stepId && edge.targetId !== stepId,
      )
      if (this.selected?.kind === 'step' && this.selected.stepId === stepId) {
        this.selected = null
      }
      this.isDirty = true
    },

    pickStepType(stepId: string, type: AddableStepType) {
      const step = this.document.steps[stepId]
      if (!step || step.type !== 'step-picker') return

      const { label, config } = createDefaultStepConfig(type)
      this.document.steps[stepId] = {
        ...step,
        type,
        label,
        config,
      }

      if (type === 'send-message' || type === 'custom') {
        const pickerId = this.appendPickerAfter(stepId, 'then')
        positionNewStep(this.document, stepId, 'then', pickerId)
      } else {
        const yesPickerId = this.appendPickerAfter(stepId, 'yes')
        const noPickerId = this.appendPickerAfter(stepId, 'no')
        positionNewStep(this.document, stepId, 'yes', yesPickerId)
        positionNewStep(this.document, stepId, 'no', noPickerId)
      }

      this.selected = { kind: 'step', stepId }
      this.isDirty = true
    },

    appendPickerAfter(sourceId: string, sourcePort: SourcePort = 'then'): string {
      const newPickerId = crypto.randomUUID()
      this.document.steps[newPickerId] = {
        id: newPickerId,
        type: 'step-picker',
        label: 'Choose next step',
        config: {},
        position: { x: 0, y: 0 },
      }
      this.document.edges.push({
        id: crypto.randomUUID(),
        sourceId,
        targetId: newPickerId,
        sourcePort,
        targetPort: 'in',
      })
      return newPickerId
    },

    upsertEdge(edge: FlowEdge) {
      this.document.edges = this.document.edges.filter(
        (item) => !(item.sourceId === edge.sourceId && item.sourcePort === edge.sourcePort),
      )
      this.document.edges.push(edge)
      this.isDirty = true
    },

    removeEdge(edgeId: string) {
      this.document.edges = this.document.edges.filter((edge) => edge.id !== edgeId)
      this.isDirty = true
    },

    saveDraft() {
      persistDraft(this.document)
      this.isDirty = false
    },

    publish(): string[] {
      const errors = validateForPublish(this.document)
      if (errors.length) return errors
      this.document = publishFlow(this.document)
      this.isDirty = false
      return []
    },
  },
})
