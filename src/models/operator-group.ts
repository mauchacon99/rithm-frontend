import { OperatorType } from '.';

/**
 * Represents the operator group of the rules.
 */
export interface OperatorGroup {
  /** The text of operator. */
  text: string;

  /** The value to operate. */
  value: OperatorType;
}
