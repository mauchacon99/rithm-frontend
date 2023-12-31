import { QuestionFieldType } from './enums';

/**
 * Represents the answers to the document questions.
 */
export interface DocumentAnswer {
  /** The id the question. */
  readonly questionRithmId: string;

  /** The id the document. */
  documentRithmId: string;

  /** The id station. */
  stationRithmId: string;

  /** Value the answer to question. */
  value: string;

  /** File to answer. */
  file?: File;

  /** Name to file answer. */
  filename?: string;

  /** Type the answer. */
  type: QuestionFieldType;

  /** Question is updated or not. */
  questionUpdated: boolean;
}
