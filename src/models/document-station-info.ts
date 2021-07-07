
/**
 * Represents all information about document and station.
 */
export interface DocumentStationInformation {

  /** The name of the document. */
  documentName: string;

  /** The priority of the document. */
  documentPriority: number;

  /** The user who is assigned. */
  currentAssignedUser: string;

  /** The flowed Time in UTC. */
  flowedTimeUTC: string;

  /** The last updated Time in UTC. */
  lastUpdatedUTC: string;

  /** The name of the station. */
  stationName: string;

  /** The priority of the station. */
  stationPriority: number;

  /** The list of supervisors. */
  supervisorRoster: Array<string>;

  /** The list of workers. */
  workerRoster: Array<string>;
}
