import { QuestionList } from './question-list';
import { ConnectedStationInfo } from './connected-station-info';
import { StationRosterMember } from './station-roster-member';

/**
 * Represents all information about station.
 *
 */
export interface StationInformation {

  /** The global Rithm ID. */
  rithmId: string;

  /** The name of the task. */
  name: string;

  /** The Instructions for the station. */
  instructions: string;

  /** Due Date of ticket after it reaches this task. */
  dueDate: string;

  /** The list of previous stations. */
  nextStations: ConnectedStationInfo[];

  /** The list of previous stations. */
  previousStations: ConnectedStationInfo[];

  /** The list of supervisors for the station. */
  supervisors: StationRosterMember[];

  /** List of Workers who will work on Documents in the Station. */
  workers: StationRosterMember[];

  /** User who created the station. */
  createdByRithmId: string;

  /** Date the station was created. */
  createdDate: string;

  /** User who updated the station. */
  updatedByRithmId: string;

  /** Date the station was updated. */
  updatedDate: string;

  /** The list of fields in the template area for the document/station. */
  questions: QuestionList[];
}