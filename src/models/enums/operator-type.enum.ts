/**
 * Represents all the different types of operators for rules.
 */
export enum OperatorType {
  /** Greater Than Field. */
  GreaterThan = '>',

  /** Lesser Than Field. */
  LesserThan = '<',

  /** Greater Or Equal Field. */
  GreaterOrEqual = '>=',

  /** Lesser Or Equal Field. */
  LesserOrEqual = '<=',

  /** Equal To Field. */
  EqualTo = '==',

  /** Not Equal To Field. */
  NotEqualTo = '!=',

  /** Before Field.*/
  Before = 'before',

  /** After Field. */
  After = 'after',

  /** Contains Field. */
  Contains = 'contains',

  /** Does Not Contain Field. */
  NotContains = 'not contains',

  /** Date Field On. */
  On = 'on',
}
