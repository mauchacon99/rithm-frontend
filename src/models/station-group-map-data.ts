import { MapItemStatus } from '.';

/**
 * Represents all info about a station group as returned from and to be sent to the API.
 */
export interface StationGroupMapData {
  /** The global Rithm id for the station group. */
  readonly rithmId: string;

  /** The id of the organization that this station group belongs to. */
  readonly organizationRithmId?: string;

  /** The name of the station group. */
  title: string;

  /**
   * The ids of the stations contained immediately within this station group.
   * Does not include stations in nested station groups (immediate children only).
   */
  stations: string[];

  /**
   * The ids of the station groups contained immediately within this station group.
   * Does not include station groups nested more than one level deep (immediate children
   * only).
   */
  subFlows: string[];

  /** The status of the station group (what should happen to this station group). */
  status: MapItemStatus;

  /** Whether this station group is the implicit, root station group for the whole map. This should not be sent to the API. */
  readonly isReadOnlyRootFlow: boolean;
}
