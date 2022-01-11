/**
 * All of the various modes/states of the map.
 */
export enum MapMode {
  /** The map is only allowed to be viewed without changes. */
  View,

  /** The map is in the process of being modified. */
  Build,

  /** The map is waiting for a location to be selected for a new station. */
  StationAdd,

  /** The map is waiting for a location to be selected for a new flow. */
  StationGroupAdd,
}
