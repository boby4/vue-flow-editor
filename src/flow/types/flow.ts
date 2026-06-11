export type FlowStatus = 'draft' | 'published'
export type StepType = 'step-picker' | 'send-message' | 'condition' | 'custom'
export type SourcePort = 'then' | 'yes' | 'no'
export type TargetPort = 'in'
export type AddableStepType = Exclude<StepType, 'step-picker'>

export interface TriggerItem {
  id: string
  type: 'whatsapp-url'
  name: string
  config: { preFilledMessage: string }
}

export interface SendMessageConfig {
  text: string
}

export interface ConditionConfig {
  field: string
  operator: 'equals' | 'contains' | 'exists'
  value: string
}

export interface CustomConfig {
  icon: string
  title: string
  description: string
  content: string
}

export type StepConfig = Record<string, never> | SendMessageConfig | ConditionConfig | CustomConfig

export interface FlowStep {
  id: string
  type: StepType
  label: string
  config: StepConfig
  position: { x: number; y: number }
}

export interface FlowEdge {
  id: string
  sourceId: string
  targetId: string
  sourcePort: SourcePort
  targetPort: TargetPort
}

export interface FlowDocument {
  id: string
  title: string
  status: FlowStatus
  channelName: string
  updatedAt: string
  version: number
  triggers: TriggerItem[]
  steps: Record<string, FlowStep>
  edges: FlowEdge[]
  rootStepId: string | null
  triggerPosition: { x: number; y: number }
}

export type SelectableTarget =
  | { kind: 'trigger'; triggerId: string }
  | { kind: 'step'; stepId: string }

export const TRIGGER_VIRTUAL_ID = '__trigger__'

export function createEmptyFlow(): FlowDocument {
  const pickerId = crypto.randomUUID()
  const triggerId = crypto.randomUUID()

  return {
    id: crypto.randomUUID(),
    title: 'Untitled',
    status: 'draft',
    channelName: 'WhatsApp',
    updatedAt: new Date().toISOString(),
    version: 1,
    triggers: [
      {
        id: triggerId,
        type: 'whatsapp-url',
        name: 'WhatsApp URL #1',
        config: { preFilledMessage: '' },
      },
    ],
    steps: {
      [pickerId]: {
        id: pickerId,
        type: 'step-picker',
        label: 'Choose first step',
        config: {},
        position: { x: 420, y: 230 },
      },
    },
    edges: [
      {
        id: crypto.randomUUID(),
        sourceId: TRIGGER_VIRTUAL_ID,
        targetId: pickerId,
        sourcePort: 'then',
        targetPort: 'in',
      },
    ],
    rootStepId: pickerId,
    triggerPosition: { x: 420, y: 80 },
  }
}
