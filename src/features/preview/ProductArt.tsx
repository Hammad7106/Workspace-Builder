import type { ProductId } from '@/features/catalog'
import { ART_STROKE } from './art/palette'
import { ART } from './art/registry'

/** A product illustration as a standalone, square, decorative SVG (used for thumbnails). */
export function ProductArt({ id, className }: { id: ProductId; className?: string }) {
  const { Art, width, height } = ART[id]
  const size = Math.max(width, height) * 1.1
  // Centre the art (which spans y ∈ [-height, 0]) in a square viewBox.
  const viewBox = `${-size / 2} ${-height / 2 - size / 2} ${size} ${size}`

  return (
    <svg viewBox={viewBox} className={className} aria-hidden focusable="false">
      <g {...ART_STROKE}>
        <Art />
      </g>
    </svg>
  )
}
