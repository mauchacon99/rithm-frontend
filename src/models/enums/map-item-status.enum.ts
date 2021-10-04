/**
 * Represents all the states an item can have on the map.
 */
export enum MapItemStatus {

  /** The item on the map has been newly created and has yet to be published. */
  created,

  /** The item on the map has been updated from a previously published state. */
  updated,

  /** The item on the map has been deleted from a previously published state. */
  deleted,
}
