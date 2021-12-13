import { QuestionFieldType } from '.';
import { PossibleAnswer } from './possible-answer';

/**
 * Represents a question/field on a station or document.
 */
export interface Question {
  /** The global Rithm ID for the question type. */
  rithmId: string;

  /** The name/label of the question. */
  prompt: string;

  /** Type of the question. */
  questionType: QuestionFieldType;

  /** Whether the question is encrypted or not. */
  isEncrypted?: boolean;

  /** Whether the question is read only and only for reference. */
  isReadOnly: boolean;

  /** Whether the question is required for the worker to fill out. */
  isRequired: boolean;

  /** Whether the question is private. */
  isPrivate: boolean;

  /** The list of selectable answers for the question (for a select or checklist). */
  possibleAnswers?: PossibleAnswer[];

  /** The children for nested questions. */
  children: Question[];

  /** Value of the new field (what do you call your field?). */
  value?: string;

  /** Value of the Rithm ID current station to identify previous field. */
  originalStationRithmId?: string | null;

}
