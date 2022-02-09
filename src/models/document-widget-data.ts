import { Question } from './question';

/**
 * Represents the data the station-widget.
 */
export interface documentWidget {
  /** The name of the document. */
  documentName: string;
  /** The Document rithmId. */
  documentRithmId: string;
  /** The list of the questions. */
  questions: Question[];
}
