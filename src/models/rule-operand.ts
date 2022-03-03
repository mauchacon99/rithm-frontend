import { OperandType, QuestionFieldType } from '.';

/**
 * Represents the data to operate on the equation of the rules.
 */
export interface RuleOperand {
  /** The type of data to operate. */
  type: OperandType;

  /** The type of question. */
  questionType: QuestionFieldType;

  /** The data value to operate. */
  value: string;

  /** The text to show if the operand is fieldType. */
  text: string;
}
