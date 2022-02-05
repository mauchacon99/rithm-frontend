import { Question } from './question';
import { StationRosterMember } from './station-roster-member';

/**
 * Represents all information about document and station.
 *
 * @see `DocumentInfoViewModel` in back end.
 */
export interface DocumentStationInformation {
  /** The name of the document. */
  documentName: string;

  /** The priority of the document. */
  documentPriority: number;

  /** The first and last name of the user who is assigned. */
  currentAssignedUser: string;

  /** The time at which this document was most recently flowed as an ISO string date. */
  flowedTimeUTC: string;

  /** The time at which this document was last updated as an ISO string date. */
  lastUpdatedUTC: string;

  /** The global Rithm id for the station. */
  stationRithmId: string;

  /** The name of the station. */
  stationName: string;

  /** The priority of the station. */
  stationPriority: number;

  /** The general instructions for the whole station, if any. */
  stationInstruction: string;

  /** The list of station owners. */
  stationOwners: StationRosterMember[];

  /** The list of workers. */
  workers: StationRosterMember[];

  /** The global Rithm ID for the document. */
  documentRithmId: string;

  /** The list of fields in the template area for the document/station. */
  questions: Question[];

  /** The Instructions for the station. */
  instructions: string;
}
