import { inject, onBeforeUnmount, ref } from 'vue'
import type { Node } from '@antv/x6'

export function useX6NodeData<T extends Record<string, unknown> = Record<string, unknown>>() {
  const getNode = inject<() => Node>('getNode')
  const data = ref<T>({} as T)

  const node = getNode?.()
  if (node) {
    data.value = { ...(node.getData() as T) }

    const handler = () => {
      data.value = { ...(node.getData() as T) }
    }

    node.on('change:data', handler)
    onBeforeUnmount(() => {
      node.off('change:data', handler)
    })
  }

  return data
}
