import { Document } from './document';
import { UserType } from './enums';

/**
 * Station documents data.
 */
export interface StationDocuments {
  /** The list of the documents for the station. */
  documents: Document[];

  /** The total number of documents in the station. */
  totalDocuments: number;

  /** The role of the user accessing the documents (in relation to the station). */
  userType: UserType;
}
