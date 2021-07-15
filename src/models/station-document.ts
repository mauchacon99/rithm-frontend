import { Document } from './document';
/**
 * Station documents data.
 */
 export interface StationDocumentsResponse {
  /** List of the documents. */
  documents: Array<Document>;

  /** Total number of documents. */
  totalDocuments: number;

  /** The user role is worker, admin, supervisor or none. */
  userType: string;

}
