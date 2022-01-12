import { RuleOperand, OperatorType } from '.';

/**
 * Represents all the data of the equation of the rule.
 */
export interface RuleEquation {
  /** The left side of the equation. */
  leftOperand: RuleOperand;

  /** The type of equation operator. */
  operatorType: OperatorType;

  /** The right side of the equation. */
  rightOperand: RuleOperand;
}
