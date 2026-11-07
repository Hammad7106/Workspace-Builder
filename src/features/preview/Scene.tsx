import { useMemo, type ReactNode } from 'react'
import type { ProductId } from '@/features/catalog'
import type { WorkspaceState } from '@/features/workspace'
import { GhostChair } from './art/chairs'
import { GhostDesk } from './art/desks'
import { ART_STROKE } from './art/palette'
import { ART } from './art/registry'
import { Backdrop } from './Backdrop'
import { describeSetup } from './describe'
import { SCENE } from './geometry'
import { layoutScene } from './layout'

interface PlacedProps {
  x: number
  y: number
  scale?: number
  productId?: ProductId
  children: ReactNode
}

/**
 * Positions an illustration. The outer group's CSS transform transitions, so items
 * glide when the layout shifts (e.g. monitors re-spacing on a wider desk); the inner
 * group pops in on mount. Both are disabled for users who prefer reduced motion.
 */
function Placed({ x, y, scale = 1, productId, children }: PlacedProps) {
  return (
    <g
      data-product={productId}
      style={{ transform: `translate(${x}px, ${y}px) scale(${scale})` }}
      className="motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out"
    >
      <g className="origin-bottom [transform-box:fill-box] motion-safe:animate-pop-in">{children}</g>
    </g>
  )
}

/** The live workspace illustration, redrawn from the setup state. */
export function Scene({ state }: { state: WorkspaceState }) {
  const { desk, chair, accessories } = useMemo(() => layoutScene(state), [state])
  const DeskArt = desk.id && ART[desk.id].Art
  const ChairArt = chair.id && ART[chair.id].Art

  return (
    <svg
      viewBox={`0 0 ${SCENE.width} ${SCENE.height}`}
      role="img"
      aria-label={describeSetup(state)}
      preserveAspectRatio="xMidYMax meet"
      className="h-auto w-full"
    >
      <Backdrop />
      <g {...ART_STROKE}>
        <Placed key={desk.id ?? 'ghost-desk'} x={desk.x} y={desk.y} productId={desk.id ?? undefined}>
          {DeskArt ? <DeskArt /> : <GhostDesk width={desk.width} />}
        </Placed>

        {accessories.map(({ key, productId, x, y, scale }) => {
          const { Art } = ART[productId]
          return (
            <Placed key={key} x={x} y={y} scale={scale} productId={productId}>
              <Art />
            </Placed>
          )
        })}

        <Placed key={chair.id ?? 'ghost-chair'} x={chair.x} y={chair.y} scale={chair.scale} productId={chair.id ?? undefined}>
          {ChairArt ? <ChairArt /> : <GhostChair />}
        </Placed>
      </g>
    </svg>
  )
}
