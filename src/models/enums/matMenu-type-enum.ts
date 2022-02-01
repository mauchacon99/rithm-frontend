/**
 * All of the various modes/states of the map.
 */
export enum MatMenuOption {
  /** The map is only allowed to be viewed without changes. */
  None,

  /** The map is in the process of being modified. */
  OptionButton,

  /** The map is waiting for a location to be selected for a new station. */
  NewStation,
}
