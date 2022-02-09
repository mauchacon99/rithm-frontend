import { Question } from './question';

/**
 * Represents the data the document-widget.
 */
export interface DocumentWidget {
  /** The name of the document. */
  documentName: string;
  /** The Document rithmId. */
  documentRithmId: string;
  /** The list of the questions. */
  questions: Question[];
}
