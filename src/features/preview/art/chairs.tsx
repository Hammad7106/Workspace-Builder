import { PALETTE as P } from './palette'

/*
 * Chair illustrations, seen from behind (the user is sitting at the desk).
 * Origin is bottom-centre; the drawing extends upwards into negative y.
 */

/** Five-star base with casters and a gas lift. */
function SwivelBase({ liftTop }: { liftTop: number }) {
  return (
    <g>
      <rect x={-4} y={liftTop} width={8} height={-16 - liftTop} fill={P.aluminium} />
      <path d="M -60 -9 L 0 -21 L 60 -9 L 60 -4 L 0 -15 L -60 -4 Z" fill={P.metalDark} />
      {[-56, -24, 24, 56].map((cx) => (
        <circle key={cx} cx={cx} cy={-5} r={5} fill={P.outline} />
      ))}
    </g>
  )
}

export function TaskChair() {
  return (
    <g>
      <SwivelBase liftTop={-66} />
      <rect x={-48} y={-82} width={96} height={16} rx={8} fill={P.mesh} />
      <rect x={-5} y={-98} width={10} height={18} fill={P.metalDark} />
      <rect x={-40} y={-176} width={80} height={84} rx={20} fill={P.meshLight} />
      <g stroke={P.mesh} strokeWidth={1.5} opacity={0.7}>
        {[-24, -8, 8, 24].map((x) => (
          <line key={x} x1={x} y1={-166} x2={x} y2={-102} />
        ))}
      </g>
    </g>
  )
}

export function ErgonomicChair() {
  return (
    <g>
      <SwivelBase liftTop={-68} />
      <rect x={-50} y={-84} width={100} height={18} rx={9} fill={P.fabricDark} />
      {[-1, 1].map((side) => (
        <g key={side}>
          <rect x={side * 57 - 3} y={-114} width={6} height={34} fill={P.metalDark} />
          <rect x={side > 0 ? 44 : -76} y={-120} width={32} height={8} rx={4} fill={P.outline} />
        </g>
      ))}
      <rect x={-44} y={-192} width={88} height={102} rx={24} fill={P.fabric} />
      <rect x={-30} y={-124} width={60} height={10} rx={5} fill={P.fabricDark} />
      <rect x={-20} y={-208} width={6} height={18} fill={P.metalDark} />
      <rect x={14} y={-208} width={6} height={18} fill={P.metalDark} />
      <rect x={-32} y={-224} width={64} height={22} rx={10} fill={P.fabric} />
    </g>
  )
}

export function BalanceStool() {
  return (
    <g>
      <path d="M -42 0 Q 0 -28 42 0 Z" fill={P.metalDark} />
      <rect x={-5} y={-104} width={10} height={88} fill={P.aluminium} />
      <rect x={-44} y={-118} width={88} height={16} rx={8} fill={P.cushionDark} />
      <ellipse cx={0} cy={-118} rx={44} ry={8} fill={P.cushion} />
    </g>
  )
}

/** Dashed outline shown until a chair is picked. */
export function GhostChair() {
  return (
    <g fill="none" stroke={P.ghost} strokeDasharray="6 5">
      <rect x={-42} y={-178} width={84} height={86} rx={20} />
      <rect x={-48} y={-84} width={96} height={16} rx={8} />
      <path d="M 0 -68 V -18 M -56 -6 L 0 -18 L 56 -6" />
      <text x={0} y={-130} textAnchor="middle" fill={P.ghostText} stroke="none" fontSize={13} fontWeight={700}>
        Pick a chair
      </text>
    </g>
  )
}
