let rebuilding = false

export function runGraphRebuild(fn: () => void): void {
  rebuilding = true
  try {
    fn()
  } finally {
    rebuilding = false
  }
}

export function isGraphRebuilding(): boolean {
  return rebuilding
}
