import { getDesk, type DeskId } from '@/features/catalog'
import { DESK_HEIGHT, DESK_TOP_DEPTH, deskWidthPx } from '../geometry'
import { PALETTE as P } from './palette'

/*
 * Desk illustrations. Origin is bottom-centre (where the desk meets the floor);
 * the drawing extends upwards into negative y.
 */

const SLAB = 12

interface DeskStyle {
  top: string
  edge: string
  frame: string
  frameLight: string
  legWidth: number
  /** Telescoping leg sections; more stages read as a sturdier standing desk. */
  stages: 1 | 2 | 3
  crossbar: boolean
  controlPanel: boolean
  crank: boolean
}

const STYLES = {
  mechanical: {
    top: P.teak,
    edge: P.teakEdge,
    frame: P.metalDark,
    frameLight: P.metalDark,
    legWidth: 10,
    stages: 1,
    crossbar: false,
    controlPanel: false,
    crank: true,
  },
  electric: {
    top: P.oak,
    edge: P.oakEdge,
    frame: P.metalLight,
    frameLight: '#ffffff',
    legWidth: 14,
    stages: 2,
    crossbar: false,
    controlPanel: true,
    crank: false,
  },
  dualMotor: {
    top: P.walnut,
    edge: P.walnutEdge,
    frame: P.metalDark,
    frameLight: '#55524d',
    legWidth: 18,
    stages: 3,
    crossbar: true,
    controlPanel: true,
    crank: false,
  },
} as const satisfies Record<string, DeskStyle>

function topPoints(width: number) {
  const H = DESK_HEIGHT
  const D = DESK_TOP_DEPTH
  return `${-width / 2},${-H} ${width / 2},${-H} ${width / 2 - 14},${-H - D} ${-width / 2 + 14},${-H - D}`
}

function DeskArt({ width: W, style: s }: { width: number; style: DeskStyle }) {
  const H = DESK_HEIGHT
  const legX = W / 2 - 34
  const legTop = -H + SLAB
  const legLength = H - SLAB - 8
  const stageLength = legLength / s.stages

  return (
    <g>
      {s.crossbar && <rect x={-legX} y={legTop + 14} width={legX * 2} height={8} fill={s.frame} />}

      {[-legX, legX].map((x) => (
        <g key={x}>
          {Array.from({ length: s.stages }, (_, stage) => {
            const legWidth = s.legWidth - stage * 3
            return (
              <rect
                key={stage}
                x={x - legWidth / 2}
                y={legTop + stage * stageLength}
                width={legWidth}
                height={legLength - stage * stageLength}
                fill={stage % 2 ? s.frameLight : s.frame}
              />
            )
          })}
          <rect x={x - 30} y={-9} width={60} height={9} rx={4} fill={s.frame} />
        </g>
      ))}

      <polygon points={topPoints(W)} fill={s.top} />
      <rect x={-W / 2} y={-H} width={W} height={SLAB} rx={3} fill={s.edge} />

      {s.controlPanel && (
        <g>
          <rect x={-W / 2 + 26} y={legTop} width={32} height={9} rx={2} fill={P.metalDark} />
          <circle cx={-W / 2 + 50} cy={legTop + 4.5} r={1.8} fill="#7cffb2" stroke="none" />
        </g>
      )}
      {s.crank && (
        <g>
          <path d={`M ${W / 2 - 58} ${legTop + 1} v 11 h 14`} fill="none" strokeWidth={3} />
          <circle cx={W / 2 - 43} cy={legTop + 12} r={3.5} fill={s.frame} />
        </g>
      )}
    </g>
  )
}

const widthOf = (id: DeskId) => deskWidthPx(getDesk(id).size.widthCm)

export const MechanicalDesk = () => <DeskArt width={widthOf('desk-mechanical')} style={STYLES.mechanical} />
export const ElectricDesk = () => <DeskArt width={widthOf('desk-electric')} style={STYLES.electric} />
export const DualMotorDesk = () => <DeskArt width={widthOf('desk-dual-motor')} style={STYLES.dualMotor} />

/** Dashed outline shown until a desk is picked. */
export function GhostDesk({ width: W }: { width: number }) {
  const H = DESK_HEIGHT
  const legX = W / 2 - 34
  return (
    <g fill="none" stroke={P.ghost} strokeDasharray="7 6">
      <polygon points={topPoints(W)} />
      <rect x={-W / 2} y={-H} width={W} height={SLAB} rx={3} />
      {[-legX, legX].map((x) => (
        <path key={x} d={`M ${x} ${-H + SLAB} V -4 M ${x - 28} -2 H ${x + 28}`} />
      ))}
      <text
        x={0}
        y={-H - DESK_TOP_DEPTH - 14}
        textAnchor="middle"
        fill={P.ghostText}
        stroke="none"
        fontSize={15}
        fontWeight={700}
      >
        Pick a desk
      </text>
    </g>
  )
}
