import { QuestionFieldType } from './enums';

/**
 * Represents the answers to the document questions.
 */

export interface DocumentAnswer {

  /** The id the question. */
  readonly questionRithmId: string;

  /** The id the document. */
  readonly documentRithmId: string;

  /** The id station. */
  readonly stationRithmId: string;

  /** Value the answer to question. */
  value: string;

  /** File to answer. */
  file: string;

  /** Name to file answer. */
  filename: string;

  /** Type the answer. */
  type: QuestionFieldType;

  /** Id to answer. */
  rithmId: string;

  /** Question is updated or not. */
  questionUpdated: boolean;
}
