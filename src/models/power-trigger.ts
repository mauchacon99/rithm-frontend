import { TriggerType } from "./enums/trigger-type.enum";

/**
 * Represents the triggers in the powers of a station.
 */
export interface PowerTrigger {
  /** Rithm Id. */
  rithmId: string;
  /** Type Trigger. */
  type: TriggerType;
  /** Source Trigger. */
  source: string;
  /** Value of Trigger. */
  value: string;
}
