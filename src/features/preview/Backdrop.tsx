import { PALETTE as P } from './art/palette'
import { SCENE } from './geometry'

const PALM_FRONDS = ['q -16 -8 -34 4', 'q 14 -12 32 -2', 'q -8 -16 -24 -18', 'q 10 -16 26 -14', 'q -2 -14 2 -24']

function Palm({ x, flip = false }: { x: number; flip?: boolean }) {
  const s = flip ? -1 : 1
  const top = { x: x + s * 18, y: 50 }
  return (
    <g stroke={P.palm} fill="none" strokeLinecap="round">
      <path d={`M ${x} 130 Q ${x + s * 4} 86 ${top.x} ${top.y}`} strokeWidth={5} />
      <g transform={flip ? `translate(${top.x * 2} 0) scale(-1 1)` : undefined} strokeWidth={6}>
        {PALM_FRONDS.map((frond) => (
          <path key={frond} d={`M ${top.x} ${top.y} ${frond}`} />
        ))}
      </g>
    </g>
  )
}

/** The static room: a window onto a Bali sunset, and the floor. */
export function Backdrop() {
  const { centerX: cx, floorY } = SCENE
  return (
    <g>
      <g transform={`translate(${cx - 160} 18)`}>
        <rect width={320} height={140} rx={14} fill={P.windowFrame} stroke={P.floorEdge} strokeWidth={6} />
        <g transform="translate(10 10)">
          <rect width={300} height={120} fill={P.sky} />
          <circle cx={214} cy={76} r={24} fill={P.sun} />
          <rect y={76} width={300} height={44} fill={P.sea} />
          <Palm x={34} />
          <Palm x={266} flip />
        </g>
        <line x1={160} y1={10} x2={160} y2={130} stroke={P.windowFrame} strokeWidth={6} />
      </g>

      <ellipse cx={cx} cy={floorY + 18} rx={350} ry={42} fill={P.floor} stroke={P.floorEdge} strokeWidth={2} />
      <ellipse cx={cx} cy={floorY + 22} rx={230} ry={24} fill={P.rug} />
    </g>
  )
}
