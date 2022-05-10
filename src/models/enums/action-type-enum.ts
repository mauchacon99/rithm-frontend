/**
 * Represents all the type of actions for the station powers.
 */
export enum ActionType {
  /** POST action type. */
  Post = 'post',

  /** GET action type. */
  Get = 'get',

  /** Create a new document. */
  CreateDocument = 'createDocument',

  /** Archive a document. */
  ArchiveDocument = 'archiveDocument',
}
