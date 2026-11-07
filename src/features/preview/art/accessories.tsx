import { PALETTE as P } from './palette'

/*
 * Accessory illustrations. Origin is bottom-centre (where the item rests);
 * the drawing extends upwards into negative y.
 */

/** 24" monitor showing a code editor. */
export function Monitor24() {
  const lines = [
    { x: -50, w: 34, c: P.sun },
    { x: -44, w: 52, c: '#aed1ba' },
    { x: -44, w: 40, c: '#dccaae' },
    { x: -38, w: 58, c: '#aed1ba' },
    { x: -50, w: 22, c: P.sun },
    { x: -44, w: 46, c: '#dccaae' },
  ]
  return (
    <g>
      <rect x={-22} y={-5} width={44} height={5} rx={2} fill={P.metalDark} />
      <rect x={-4} y={-26} width={8} height={22} fill={P.metalDark} />
      <rect x={-60} y={-98} width={120} height={74} rx={5} fill={P.bezel} />
      <rect x={-55} y={-93} width={110} height={62} rx={2} fill={P.screen} stroke="none" />
      <g stroke="none">
        {lines.map((line, i) => (
          <rect key={i} x={line.x} y={-87 + i * 9} width={line.w} height={4} rx={2} fill={line.c} />
        ))}
      </g>
    </g>
  )
}

/** 27" 4K monitor showing a Bali sunset. */
export function Monitor27() {
  return (
    <g>
      <rect x={-26} y={-5} width={52} height={5} rx={2} fill={P.metalLight} />
      <rect x={-5} y={-30} width={10} height={26} fill={P.metalLight} />
      <rect x={-73} y={-116} width={146} height={88} rx={5} fill={P.bezel} />
      <g stroke="none">
        <rect x={-69} y={-112} width={138} height={80} fill={P.sky} />
        <circle cx={18} cy={-62} r={16} fill={P.sun} />
        <rect x={-69} y={-62} width={138} height={30} fill={P.sea} />
        <path d="M -52 -32 Q -46 -70 -34 -84" fill="none" stroke={P.palm} strokeWidth={3} />
        <path
          d="M -34 -84 q -12 -4 -22 4 M -34 -84 q 12 -6 20 2 M -34 -84 q -4 -12 -14 -14 M -34 -84 q 8 -10 18 -8"
          fill="none"
          stroke={P.palm}
          strokeWidth={3.5}
        />
      </g>
    </g>
  )
}

/** Articulated desk lamp throwing warm light onto the desk. */
export function DeskLamp() {
  return (
    <g>
      <polygon points="-2,-76 40,-76 64,-4 -26,-4" fill={P.glow} opacity={0.3} stroke="none" />
      <ellipse cx={0} cy={-4} rx={18} ry={5} fill={P.metalDark} />
      <polyline points="0,-6 -16,-56 19,-90" fill="none" stroke={P.metalDark} strokeWidth={4} />
      <circle cx={-16} cy={-56} r={3.5} fill={P.lampShade} />
      <path d="M 8 -98 L 30 -98 L 40 -76 L -2 -76 Z" fill={P.lampShade} />
    </g>
  )
}

/** Monstera in a terracotta pot. */
export function Monstera() {
  const leaves = [
    { cx: -24, cy: -60, angle: -40 },
    { cx: 22, cy: -66, angle: 38 },
    { cx: -2, cy: -86, angle: -4 },
    { cx: 30, cy: -44, angle: 70 },
  ]
  return (
    <g>
      {leaves.map(({ cx, cy }, i) => (
        <path key={`stem-${i}`} d={`M 0 -32 Q ${cx / 2} ${cy / 1.4} ${cx} ${cy}`} fill="none" stroke={P.leafDark} strokeWidth={2.5} />
      ))}
      {leaves.map(({ cx, cy, angle }, i) => (
        <g key={i} transform={`rotate(${angle} ${cx} ${cy})`}>
          <ellipse cx={cx} cy={cy} rx={13} ry={20} fill={i % 2 ? P.leafDark : P.leaf} />
          <path
            d={`M ${cx} ${cy - 18} V ${cy + 18} M ${cx} ${cy - 6} l -9 -4 M ${cx} ${cy + 4} l 9 -4`}
            fill="none"
            stroke={P.leafDark}
            strokeWidth={1.5}
          />
        </g>
      ))}
      <polygon points="-17,0 17,0 21,-30 -21,-30" fill={P.pot} />
      <rect x={-23} y={-35} width={46} height={7} rx={3} fill={P.potRim} />
    </g>
  )
}

/** Open laptop raised on an aluminium stand. */
export function LaptopOnStand() {
  return (
    <g>
      <rect x={-30} y={-20} width={6} height={20} fill={P.aluminium} />
      <rect x={24} y={-20} width={6} height={20} fill={P.aluminium} />
      <polygon points="-34,-20 34,-20 30,-26 -30,-26" fill={P.aluminium} />
      <rect x={-32} y={-76} width={64} height={46} rx={3} fill={P.metalLight} />
      <rect x={-28} y={-72} width={56} height={38} rx={1} fill="#aed1ba" stroke="none" />
      <rect x={-24} y={-68} width={24} height={14} rx={1} fill={P.windowFrame} stroke="none" />
      <rect x={4} y={-68} width={20} height={30} rx={1} fill={P.screen} stroke="none" opacity={0.8} />
      <polygon points="-36,-26 36,-26 32,-31 -32,-31" fill={P.metalLight} />
    </g>
  )
}

/** Wireless keyboard with a mouse beside it. */
export function KeyboardMouse() {
  return (
    <g>
      <polygon points="-58,0 58,0 52,-13 -52,-13" fill={P.metalLight} />
      <g stroke={P.ghostText} strokeWidth={1}>
        <line x1={-50} y1={-4} x2={50} y2={-4} />
        <line x1={-48} y1={-8.5} x2={48} y2={-8.5} />
      </g>
      <ellipse cx={74} cy={-5} rx={9} ry={5.5} fill={P.metalLight} />
    </g>
  )
}

/** Over-ear headphones resting on a small stand. */
export function HeadphonesOnStand() {
  return (
    <g>
      <ellipse cx={0} cy={-3} rx={14} ry={4} fill={P.metalDark} />
      <rect x={-2} y={-58} width={4} height={54} fill={P.metalDark} />
      <path d="M -22 -40 A 22 24 0 0 1 22 -40" fill="none" stroke={P.outline} strokeWidth={6} />
      <rect x={-29} y={-46} width={13} height={24} rx={5} fill={P.cushion} />
      <rect x={16} y={-46} width={13} height={24} rx={5} fill={P.cushion} />
    </g>
  )
}
