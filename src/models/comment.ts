import { Document } from './document';
import { Station } from './station';

/**
 * Represents all info about a comment on a station or document.
 */
export interface Comment {
  /** The text to display. */
  displayText: string;

  /** The date the comment was created. */
  dateCreated?: string;

  /** The date the comment was last edited. */
  dateLastEdited?: string;

  /** Indicates whether the comment is archived. */
  archived?: boolean;

  /** Id of the comment. */
  rithmId?: string;

  /** Id of user that made the comment. */
  userRithmId?: string;

  /** Id of document where the comment is located. */
  documentRithmId?: string;

  /** Document where comment is located. */
  document?: Document;

  /** Id of station where the comment is located. */
  stationRithmId?: string;

  /** Station where comment is located. */
  station?: Station;

  /** First name of the user that made the comment. */
  userFirstName?: string;

  /** Last name of user the that made the comment. */
  userLastName?: string;

  /** Full name of user the that made the comment. */
  userFullName?: string;

}
