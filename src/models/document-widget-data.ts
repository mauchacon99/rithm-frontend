import { QuestionList, StationList } from '.';

/**
 * Represents the data the document-widget.
 */
export interface DocumentWidget {
  /** The name of the document. */
  documentName: string;
  /** The Document rithmId. */
  documentRithmId: string;
  /** The list of the questions. */
  questions: QuestionList[];
  /** The station list for specific document. */
  stations: StationList[];
}
