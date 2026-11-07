/** Illustration colours, tuned to the app theme (jungle / sunset / sand). */
export const PALETTE = {
  outline: '#2b2620',
  ghost: '#c4ad86',
  ghostText: '#8f877b',

  metalDark: '#3d3b38',
  metalLight: '#e9e6df',
  aluminium: '#cfd3d6',

  teak: '#d9a56b',
  teakEdge: '#b98049',
  oak: '#f1e4c8',
  oakEdge: '#d8c39b',
  walnut: '#8b5a3c',
  walnutEdge: '#694027',

  mesh: '#3b4a43',
  meshLight: '#52645b',
  fabric: '#3f7a55',
  fabricDark: '#2a5a3c',
  cushion: '#e07a4f',
  cushionDark: '#c9603a',

  bezel: '#232220',
  screen: '#1d2b26',
  leaf: '#3f7a55',
  leafDark: '#2a5a3c',
  pot: '#c9603a',
  potRim: '#b4532f',
  lampShade: '#e07a4f',
  glow: '#ffd27a',

  wall: '#fdfaf5',
  windowFrame: '#fffaf2',
  sky: '#fde3cf',
  sun: '#f2a37a',
  sea: '#9cc9c4',
  palm: '#3f7a55',
  floor: '#ece0cc',
  floorEdge: '#dccaae',
  rug: '#e4d3b6',
} as const

/** Shared "sticker" outline applied to every illustration. */
export const ART_STROKE = {
  stroke: PALETTE.outline,
  strokeWidth: 2,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
} as const
