import { Document } from './document';
/**
 * Station documents data.
 */
 export interface StationDocument {
  /** List of the documents. */
  documentList: Array<Document>;

  /** Total number of documents. */
  numberOfDocument: number;

  /** The user is worker roster OR supervisor roster. */
  isWorker: boolean;

}
