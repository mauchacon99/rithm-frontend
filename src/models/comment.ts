import { Document } from './document';
import { Station } from './station';
import { User } from './user';

/**
 * Comment data.
 */
 export interface Comment {
  /** The text to display. */
  displayText: string;

  /** The date the comment was created. */
  dateCreated: string;

  /** The date the comment was last edited. */
  dateLastEdited?: string;

  /** Indicates whether the comment is archived. */
  archived?: boolean;

  /** Id of the comment. */
  rithmId?: string;

  /** Id of user that made the comment. */
  userRithmId?: string;

  /** User that made the comment. */
  user?: User;

  /** Id of document where the comment is located. */
  documentRithmId?: string;

  /** Document where comment is located. */
  document?: Document;

  /** Id of station where the comment is located. */
  stationRithmId?: string;

  /** Station where comment is located. */
  station?: Station;

}
