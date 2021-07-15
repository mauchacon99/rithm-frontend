/**
 * Previously Started documents data.
 */
export interface Document {
  /** Id of the user. */
  userRithmId: string;

  /** Document Id of the document. */
  documentRithmId: string;

  /** Name of the document. */
  documentName: string;

  /** Id of station. */
  stationRithmId: string;

  /** Name of the Station. */
  stationName: string;

  /** Priority of the document. */
  priority: number;

  /** The flowed Time in UTC. */
  flowedTimeUTC: string;

  /** The document id. */
  id: number;

  /** The global Rithm ID for this user. */
  rithmId: string;

  /** Name of the document. */
  docName: string;

  /** The user's first name. */
  firstName: string;

  /** The user's last name. */
  lastName: string;

  /** Date at which the doc entered current station. */
  timeEnteredStation: string;

  /** Status of blocked. */
  blocked: boolean;

  /** Last updated timestamp in UTC. */
  lastUpdated: string;

}
