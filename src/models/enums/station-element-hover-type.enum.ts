/**
 * Represents all the types of hover interactions on a station in the map.
 */
 export enum StationElementHoverType {

  /** The map cursor is currently hovering over a station. */
  station = 'station',

  /** The map cursor is currently hovering over a station button. */
  button = 'button',

  /** The map cursor is currently hovering over a station badge. */
  badge = 'badge',

  /** The map cursor is currently hovering over a station connection node. */
  node = 'node',

  /** The map cursor is not hovering over anything specific. */
  none = 'none'
}
