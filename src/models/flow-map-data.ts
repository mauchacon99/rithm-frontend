export interface FlowMapData {
  /** The global Rithm id for the flow. */
  rithmId: string;

  /** The name of the flow. */
  name: string;

  /** The ids of the stations contained immediately within this flow. Does not include stations in nested flows. */
  stationIds: string[];

  /** The ids of the flows contained immediately within this flow. Does not include flows nested more than one level deep. */
  flowIds: string[];
}
