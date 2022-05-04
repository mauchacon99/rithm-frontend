import { PowerActions } from "./power-actions";
import { PowerTrigger } from "./power-trigger";

/**
 * Represents the powers of a station.
 */
export interface Power {
  /** Rithm Id. */
  rithmId: string;
  /** Triggers. */
  triggers: PowerTrigger[];
  /** Actions. */
  actions: PowerActions[];
  /** Station Rithm Id. */
  stationRithmId: string;
  /** Flow Station Rithm Id. */
  flowToStationRithmIds: string[];
  /** Name of Power. */
  name: string;
  /** Condition of Power. */
  condition: string;
}
