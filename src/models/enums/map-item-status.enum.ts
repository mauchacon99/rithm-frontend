/**
 * Represents all the states an item can have on the map.
 */
export enum MapItemStatus {
  /** The item on the map has been newly created and has yet to be published. */
  Created,

  /** The item on the map has been updated from a previously published state. */
  Updated,

  /** The item on the map has been deleted from a previously published state. */
  Deleted,

  /** The item on the map has not been changed or modified. */
  Normal,
}
