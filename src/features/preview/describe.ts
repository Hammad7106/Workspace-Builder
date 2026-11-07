import { selectLines, type WorkspaceState } from '@/features/workspace'

const listFormat = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' })

/** Full text description of the scene, used as the preview's accessible name. */
export function describeSetup(state: WorkspaceState): string {
  const lines = selectLines(state)
  if (lines.length === 0) return 'Your workspace is empty. Pick a desk and a chair to start.'
  const items = lines.map(({ product, quantity }) => (quantity > 1 ? `${quantity} × ${product.name}` : product.name))
  return `Your workspace: ${listFormat.format(items)}.`
}

/** One-line caption under the preview heading. */
export function summarizeSetup(state: WorkspaceState): string {
  const lines = selectLines(state)
  if (lines.length === 0) return 'Pick a desk and a chair to start building. Your setup comes to life right here.'

  const extras = lines
    .filter(({ product }) => product.category === 'accessory')
    .reduce((sum, { quantity }) => sum + quantity, 0)
  const desk = lines.find(({ product }) => product.category === 'desk')?.product.name ?? 'No desk yet'
  const chair = lines.find(({ product }) => product.category === 'chair')?.product.name ?? 'No chair yet'
  const parts = [desk, chair]
  if (extras > 0) parts.push(`${extras} ${extras === 1 ? 'accessory' : 'accessories'}`)
  return parts.join(' · ')
}
