/**
 * Represents all the items of hover interactions on a station group in the map.
 */
export enum StationGroupElementHoverItem {
  /** The map cursor is hovering over the station group boundary. */
  Boundary = 'boundary',

  /** The map cursor is hovering over the station group name. */
  Name = 'name',

  /** The map cursor is not hovering over anything specific. */
  None = 'none',
}
