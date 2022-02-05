import { Rule } from '.';

/**
 * Represents the data of the logical flow rules.
 */
export interface FlowLogicRule {
  /** The station rithm id. */
  stationRithmId: string;

  /** The destination station rithm id. */
  destinationStationRithmId: string;

  /** The Flow rules. */
  flowRules: Rule[];
}
