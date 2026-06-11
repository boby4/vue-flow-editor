import { Graph, Shape } from '@antv/x6'
import { register } from '@antv/x6-vue-shape'
import TriggerNode from '../nodes/TriggerNode.vue'
import StepPickerNode from '../nodes/StepPickerNode.vue'
import SendMessageNode from '../nodes/SendMessageNode.vue'
import ConditionNode from '../nodes/ConditionNode.vue'
import CustomNode from '../nodes/CustomNode.vue'
import { NODE_SIZE } from '../constants/nodeMeta'
import { DEFAULT_EDGE_ATTRS } from './edgeStyles'
import { TRIGGER_VIRTUAL_ID } from '../types/flow'

let registered = false

const outPortAttrs = {
  circle: {
    r: 6,
    magnet: true,
    stroke: '#4fd1c5',
    strokeWidth: 2,
    fill: '#fff',
  },
}

const inPortAttrs = {
  circle: {
    r: 6,
    magnet: true,
    stroke: '#94a3b8',
    strokeWidth: 2,
    fill: '#fff',
  },
}

const portGroups = {
  in: {
    position: 'left' as const,
    attrs: inPortAttrs,
  },
  out: {
    position: 'right' as const,
    attrs: outPortAttrs,
  },
}

export function registerFlowNodes(): void {
  if (registered) return
  registered = true

  register({
    shape: 'node-trigger',
    width: NODE_SIZE.trigger.width,
    height: NODE_SIZE.trigger.height,
    component: TriggerNode,
    ports: {
      groups: portGroups,
      items: [{ id: 'then', group: 'out' }],
    },
  })

  register({
    shape: 'node-step-picker',
    width: NODE_SIZE['step-picker'].width,
    height: NODE_SIZE['step-picker'].height,
    component: StepPickerNode,
    ports: {
      groups: portGroups,
      items: [{ id: 'in', group: 'in' }],
    },
  })

  register({
    shape: 'node-send-message',
    width: NODE_SIZE['send-message'].width,
    height: NODE_SIZE['send-message'].height,
    component: SendMessageNode,
    ports: {
      groups: portGroups,
      items: [
        { id: 'in', group: 'in' },
        { id: 'then', group: 'out' },
      ],
    },
  })

  register({
    shape: 'node-condition',
    width: NODE_SIZE.condition.width,
    height: NODE_SIZE.condition.height,
    component: ConditionNode,
    ports: {
      groups: portGroups,
      items: [
        { id: 'in', group: 'in' },
        { id: 'yes', group: 'out', args: { dy: -16 } },
        { id: 'no', group: 'out', args: { dy: 16 } },
      ],
    },
  })

  register({
    shape: 'node-custom',
    width: NODE_SIZE.custom.width,
    height: NODE_SIZE.custom.height,
    component: CustomNode,
    ports: {
      groups: portGroups,
      items: [
        { id: 'in', group: 'in' },
        { id: 'then', group: 'out' },
      ],
    },
  })
}

export function createGraph(
  container: HTMLElement,
  onSelect: (refId: string, kind: 'trigger' | 'step') => void,
): Graph {
  registerFlowNodes()

  const graph = new Graph({
    container,
    grid: {
      visible: true,
      type: 'dot',
      size: 16,
      args: { color: '#e2e8f0', thickness: 1 },
    },
    panning: {
      enabled: true,
      modifiers: 'shift',
    },
    mousewheel: {
      enabled: true,
      modifiers: ['ctrl', 'meta'],
    },
    interacting: {
      nodeMovable: true,
      edgeMovable: false,
      magnetConnectable: true,
    },
    connecting: {
      snap: { radius: 30 },
      allowBlank: false,
      allowLoop: false,
      allowNode: false,
      allowMulti: false,
      highlight: true,
      connector: { name: 'smooth' },
      validateConnection({ sourceCell, targetCell, sourcePort, targetPort }) {
        if (!sourceCell || !targetCell || !sourcePort || !targetPort) return false
        if (targetCell.id === TRIGGER_VIRTUAL_ID) return false
        if (targetPort !== 'in') return false
        return ['then', 'yes', 'no'].includes(sourcePort)
      },
      createEdge() {
        return new Shape.Edge({
          id: crypto.randomUUID(),
          attrs: { ...DEFAULT_EDGE_ATTRS },
        })
      },
    },
  })

  graph.on('node:click', ({ node }: { node: { getData: () => { kind: 'trigger' | 'step'; refId: string } } }) => {
    const data = node.getData() as { kind: 'trigger' | 'step'; refId: string }
    onSelect(data.refId, data.kind)
  })

  return graph
}
