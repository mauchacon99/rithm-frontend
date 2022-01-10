/**
 * Represents all the items of hover interactions on a station in the map.
 */
export enum StationElementHoverItem {
  /** The map cursor is currently hovering over a station. */
  Station = 'station',

  /** The map cursor is currently hovering over a station button. */
  Button = 'button',

  /** The map cursor is currently hovering over a station badge. */
  Badge = 'badge',

  /** The map cursor is currently hovering over a station connection node. */
  Node = 'node',

  /** The map cursor is not hovering over anything specific. */
  None = 'none',
}
