import { RuleEquation, RuleType } from '.';

/**
 * Represents all data contained in a rule.
 */
export interface Rule {
  /** The Rule Type can be and, or. */
  ruleType: RuleType;

  /** Each equation has one one comparison of two values, can be null if this rule is just bringing together a list of rules. */
  equations: RuleEquation[];

  /** A list of rules that can be compared in an and/or situation, can be empty. */
  subRules?: Rule[];
}
