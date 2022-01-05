import { QuestionFieldType } from './enums';

/**
 * Represents all data about a question type.
 */
export interface QuestionType {
  /** The global Rithm ID for the question type. */
  rithmId: string;

  /** The type of field for this question type. */
  typeString: QuestionFieldType;

  /** The regex pattern used to validate this question type. */
  validationExpression: string;
}
