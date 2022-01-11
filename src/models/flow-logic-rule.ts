import { Rule } from '.';

/**
 * Represents the data of the logical flow rules.
 */
export interface FlowLogicRule {
  /** The station rithm id. */
  stationRithmId: string;

  /** The destination station rithm id. */
  destinationStationRithmID: string;

  /** The Flow rule. */
  flowRule: Rule;
}
