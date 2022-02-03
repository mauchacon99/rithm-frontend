/**
 * Represents all the states an item can have on the map.
 */
export enum MapItemStatus {
  //Do not change the order of these items, the backend expects them in this order.
  /** The item on the map has been newly created and has yet to be published. */
  Created,

  /** The item on the map has been updated from a previously published state. */
  Updated,

  /** The item on the map has been deleted from a previously published state. */
  Deleted,

  /**
   * The item on the map has not been changed or modified.
   * Does not exist in backend.
   */
  Normal,

  /**
   * The item on the map is pending creation. Should not be published as is.
   * Does not exist in backend.
   */
  Pending,
}
