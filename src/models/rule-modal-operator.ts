import { OperatorType } from './enums';

export interface RuleModalOperator {
  /** The operator selector text to show.*/
  text: string;

  /** The operator selector value.*/
  value: OperatorType;
}
