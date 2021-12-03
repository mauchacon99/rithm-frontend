/**
 * Represents the answers to the document questions.
 */

export interface DocumentAnswer {

  /** The id the question. */
  questionRithmId: string;

  /** The id the document. */
  documentRithmId: string;

  /** The id station. */
  stationRithmId: string;

  /** Value the answer to question. */
  value: string;

  /** File to answer. */
  file: string;

  /** Name to file answer. */
  filename: string;

  /** Type the answer. */
  type: string;

  /** Id to answer. */
  rithmId: string;

  /** Question is updated or not. */
  questionUpdated: boolean;
}
