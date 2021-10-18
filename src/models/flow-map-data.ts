import { MapItemStatus } from '.';

/**
 * Represents all info about a flow as returned from the API.
 */
export interface FlowMapData {
  /** The global Rithm id for the flow. */
  rithmId: string;

  /** The name of the flow. */
  title: string;

  /**
   * The ids of the stations contained immediately within this flow. Does not include stations in nested flows (immediate children only).
   */
  stations: string[];

  /**
   * The ids of the flows contained immediately within this flow. Does not include flows nested more than one level deep (immediate children
   * only).
   */
  subFlows: string[];

  /** The status of the flow (what should happen to this flow). */
  status: MapItemStatus;
}
