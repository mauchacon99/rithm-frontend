import { Corner } from '.';

/**
 * Represents all info about a point or coordinate in 2D space.
 */
export interface Point {
  /** The x-coordinate of the point in 2D space. */
  x: number;

  /** The y-coordinate of the point in 2D space. */
  y: number;

  /** Used to adjust the padding at the boundaries of the station group.*/
  corner?: Corner;
}
