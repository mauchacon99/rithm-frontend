/**
 * Represents all the different types of operators.
 */
export enum OperatorType {
  /** Greater Than Field. */
  GreaterThan = '>',

  /** Lesser Than Field. */
  LesserThan = '<',

  /** Greater Or Equal Field. */
  GreaterOrEqual = '>=',

  /** Lesser Or Equal Field. */
  LesserOrEqual = '<',

  /** Equal To Field. */
  EqualTo = '==',

  /** Not Equal To Field. */
  NotEqualTo = '!=',

  /** Before Field.*/
  Before = 'before',

  /** After Field. */
  After = 'after',

  /** Contains field. */
  Contains = 'contains',
}
