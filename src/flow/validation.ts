import type { FlowDocument, CustomConfig } from './types/flow'

export function validateForPublish(doc: FlowDocument): string[] {
  const errors: string[] = []

  if (!doc.triggers.length) {
    errors.push('至少需要一个触发器')
  }

  if (doc.triggers.some((t) => !t.config.preFilledMessage.trim())) {
    errors.push('触发器 Pre-filled message 不能为空')
  }

  if (Object.values(doc.steps).some((s) => s.type === 'step-picker')) {
    errors.push('存在未选择的步骤')
  }

  Object.values(doc.steps)
    .filter((s) => s.type === 'custom')
    .forEach((step) => {
      const config = step.config as CustomConfig
      if (!config.title.trim() && !config.content.trim()) {
        errors.push(`自定义节点「${step.label}」标题和内容不能同时为空`)
      }
    })

  return errors
}
