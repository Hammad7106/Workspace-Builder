/*
 * Scene geometry, in SVG user units. The scene is a front view: the desk stands on
 * the floor line, things rest on the desk top, and the chair sits in front of it.
 */

export const SCENE = {
  width: 760,
  height: 470,
  centerX: 380,
  /** Where desk legs touch the floor. */
  floorY: 400,
} as const

/** Desk widths are drawn to scale from the catalog's centimetres. */
export const PX_PER_CM = 2.6
export const deskWidthPx = (widthCm: number) => widthCm * PX_PER_CM

/** Height of the desk top's front edge above the floor. */
export const DESK_HEIGHT = 150
/** Visible depth of the desk top (drawn in slight perspective). */
export const DESK_TOP_DEPTH = 18

/** Width of the dashed placeholder desk shown before one is picked (a mid-size desk). */
export const GHOST_DESK_WIDTH = deskWidthPx(140)

/** The chair stands slightly in front of the desk. */
export const CHAIR_OFFSET_Y = 45
export const CHAIR_SCALE = 0.95
