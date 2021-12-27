/**
 * All of the various modes/states of the map.
 */
 export enum MapDragItem {

  /** Nothing is currently being dragged. */
  Default,

  /** The map is being dragged. */
  Map,

  /** A station is being dragged. */
  Station,

  /** A connection node is being dragged. */
  Node,

  /** A connection line is being dragged. */
  Connection,
}
