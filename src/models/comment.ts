/**
 * Represents all info about a comment on a station or document.
 */
export interface Comment {
  /** The text to display. */
  displayText: string;

  /** Id of station where the comment is located. */
  stationRithmId: string;

  /** Id of document where the comment is located. Only present for document comments. */
  documentRithmId?: string;

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

  /** First name of the user that made the comment. */
  userFirstName?: string;

  /** Last name of user the that made the comment. */
  userLastName?: string;

  /**
   * Full name of user the that made the comment.
   *
   * @deprecated Don't use this; it might be removed in the future. Use `userFirstName`
   * and `userLastName` instead.
   */
  userFullName?: string;

}
