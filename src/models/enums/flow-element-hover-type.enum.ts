/**
 * Represents all the types of hover interactions on a flow in the map.
 */
export enum StationGroupElementHoverType {

  /** The map cursor is hovering over the flow boundary. */
  Boundary = 'boundary',

  /** The map cursor is hovering over the flow name. */
  Name = 'name',

  /** The map cursor is not hovering over anything specific. */
  None = 'none'
}
