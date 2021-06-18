/**
 * Previously Started documents data.
 */
export interface Document {
  /** Name of the document. */
  docName: string;

  /** Name of the Station. */
  stationName: string;

  /** Date at which the doc entered current station. */
  timeEnteredStation: string;

  /** Priority of the document. */
  priority: number;

  /** The user's first name. */
  firstName: string;

  /** The user's last name. */
  lastName: string;
}
