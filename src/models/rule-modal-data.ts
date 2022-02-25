import { Rule } from './rule';

export interface RuleModalData {
  /** The station rithmId. */
  stationId: string;
  /** The data of the equation of the rule to be edited. */
  editRule: Rule | null;
}
