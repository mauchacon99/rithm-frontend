import { FieldType } from './enums';

/**
 * Represents a question.
 */
export interface Question {
  /** ID of the question. */
  id: number;
  /** Name/label of the question. */
  prompt: string;
  /** Question instructions. */
  instructions: string;
  /** Type of the question. */
  type: FieldType;
  /** Is the question read only? */
  isReadOnly: boolean;
  /** Is the question required? */
  isRequired: boolean;
}
