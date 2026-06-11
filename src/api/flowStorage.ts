import type { FlowDocument } from '@/flow/types/flow'

const KEY_PREFIX = 'flow-editor:'

function storageKey(id: string): string {
  return `${KEY_PREFIX}${id}`
}

export function saveDraft(doc: FlowDocument): void {
  const payload: FlowDocument = {
    ...doc,
    status: 'draft',
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(storageKey(doc.id), JSON.stringify(payload))
}

export function loadFlow(id: string): FlowDocument | null {
  const raw = localStorage.getItem(storageKey(id))
  if (!raw) return null
  return JSON.parse(raw) as FlowDocument
}

export function publishFlow(doc: FlowDocument): FlowDocument {
  const published: FlowDocument = {
    ...doc,
    status: 'published',
    version: doc.version + 1,
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(storageKey(doc.id), JSON.stringify(published))
  return published
}

export function listFlows(): Pick<FlowDocument, 'id' | 'title' | 'status' | 'updatedAt'>[] {
  const flows: Pick<FlowDocument, 'id' | 'title' | 'status' | 'updatedAt'>[] = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key?.startsWith(KEY_PREFIX)) continue
    const raw = localStorage.getItem(key)
    if (!raw) continue
    const doc = JSON.parse(raw) as FlowDocument
    flows.push({ id: doc.id, title: doc.title, status: doc.status, updatedAt: doc.updatedAt })
  }

  return flows
}
