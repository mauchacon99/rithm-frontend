import { OperandType } from '.';

/**
 * Represents the data to operate on the equation of the rules.
 */
export interface RuleOperand {
  /** The type of data to operate. */
  type: OperandType;

  /** The data value to operate. */
  value: string;
}
