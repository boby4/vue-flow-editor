export const DEFAULT_EDGE_ATTRS = {
  line: {
    stroke: '#94a3b8',
    strokeWidth: 2,
    targetMarker: { name: 'block', width: 8, height: 6 },
    cursor: 'pointer',
  },
  // 透明加宽描边，扩大连线点击区域
  outline: {
    stroke: 'transparent',
    strokeWidth: 12,
    cursor: 'pointer',
  },
} as const

export const SELECTED_EDGE_ATTRS = {
  line: {
    stroke: '#4fd1c5',
    strokeWidth: 3,
    targetMarker: { name: 'block', width: 8, height: 6 },
    cursor: 'pointer',
  },
  outline: {
    stroke: 'rgba(79, 209, 197, 0.15)',
    strokeWidth: 14,
    cursor: 'pointer',
  },
} as const
