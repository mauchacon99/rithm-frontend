/**
 * All of the various modes/states of the map.
 */
 export enum MapMode {

  /** The map is only allowed to be viewed without changes. */
  'view',

  /** The map is in the process of being modified. */
  'build',

  /** The map is waiting for a location to be selected for a new station. */
  'stationAdd',

  /** The map is waiting for a location to be selected for a new flow. */
  'flowAdd'
}
