import type {
  ConditionConfig,
  CustomConfig,
  SendMessageConfig,
  StepType,
} from '../types/flow'

export interface PickerOption {
  type: Exclude<StepType, 'step-picker'>
  label: string
  group: 'content' | 'logic' | 'custom'
  icon: string
}

export const PICKER_OPTIONS: PickerOption[] = [
  { type: 'send-message', label: 'Send message', group: 'content', icon: '💬' },
  { type: 'condition', label: 'Condition', group: 'logic', icon: '⑂' },
  { type: 'custom', label: 'Custom node', group: 'custom', icon: '⭐' },
]

export const ADD_NODE_OPTIONS: PickerOption[] = [...PICKER_OPTIONS]

export const NODE_SIZE = {
  trigger: { width: 280, height: 180 },
  'step-picker': { width: 360, height: 280 },
  'send-message': { width: 280, height: 96 },
  condition: { width: 280, height: 110 },
  custom: { width: 300, height: 120 },
} as const

/** 根据触发器数量计算节点高度，避免多条触发器时内容溢出 */
export function computeTriggerNodeHeight(triggerCount: number): number {
  const count = Math.max(triggerCount, 1)
  return Math.max(NODE_SIZE.trigger.height, 132 + count * 48)
}

export const PICKER_ICON_MAP: Record<string, string> = {
  chat: '💬',
  branch: '⑂',
  custom: '⭐',
}

export function createDefaultStepConfig(type: Exclude<StepType, 'step-picker'>): {
  label: string
  config: SendMessageConfig | ConditionConfig | CustomConfig
} {
  switch (type) {
    case 'send-message':
      return { label: 'Send message', config: { text: '' } }
    case 'condition':
      return { label: 'Condition', config: { field: '', operator: 'equals', value: '' } }
    case 'custom':
      return {
        label: 'Custom node',
        config: {
          icon: '⭐',
          title: 'Custom node',
          description: '',
          content: '',
        },
      }
  }
}
