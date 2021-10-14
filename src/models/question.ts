import { PossibleAnswer } from './possible-answer';
import { QuestionType } from './question-type';

/**
 * Represents a question/field on a station or document.
 */
export interface Question {

  /** The name/label of the question. */
  prompt: string;

  /** Instructions for filling out the question. */
  instructions?: string; // TODO: get this from the back end

  /** The global Rithm ID for the question type. */
  rithmId: string;

  /** Type of the question. */
  questionType: QuestionType;

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

}
