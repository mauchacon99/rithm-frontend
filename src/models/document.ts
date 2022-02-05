/**
 * Represents all info about a document as shown in a list.
 */
export interface Document {
  // /** The global Rithm ID for this user. */
  // userRithmId: string;

  /** Global Rithm ID for the document. */
  documentRithmId: string;

  /** The name of the document. */
  documentName: string;

  /** The global Rithm ID of the station containing the document. */
  stationRithmId: string;

  /** Name of the station containing the document. */
  stationName: string;

  /** The priority of the document. */
  priority: number;

  /** The time at which the document was last flowed in ISO string date format. */
  flowedTimeUTC: string;

  // /** The global Rithm ID for this user. */
  // rithmId: string;

  /** Whether the document is escalated. */
  isEscalated: boolean;

  /** Last updated timestamp in UTC. */
  updatedTimeUTC: string;

  /** The full name of the user assigned to the document. */
  userAssigned: string;
}
