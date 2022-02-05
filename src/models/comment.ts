/**
 * Represents all info about a comment on a station or document.
 */
export interface Comment {
  /** The text to display. */
  readonly displayText: string;

  /** Id of station where the comment is located. */
  readonly stationRithmId: string;

  /** Id of document where the comment is located. Only present for document comments. */
  readonly documentRithmId?: string;

  /** The date the comment was created. */
  readonly dateCreated?: string;

  /** The date the comment was last edited. */
  readonly dateLastEdited?: string;

  /** Indicates whether the comment is archived. */
  readonly archived?: boolean;

  /** Id of the comment. */
  readonly rithmId?: string;

  /** Id of user that made the comment. */
  readonly userRithmId?: string;

  /** First name of the user that made the comment. */
  readonly userFirstName?: string;

  /** Last name of user the that made the comment. */
  readonly userLastName?: string;
}
