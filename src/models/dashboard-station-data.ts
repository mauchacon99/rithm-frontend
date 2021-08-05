/**
 * Represents data about a station to be displayed on the dashboard (workers and supervisors).
 *
 * @see `StationDashViewModel` in the back end.
 */
 export interface DashboardStationData {

  /** The global Rithm ID for the station. */
  rithmId: string;

  /** The total number of documents in this station. */
  numberOfDocuments: number;

  /** The full name for the station. */
  stationName: string;

  /** The total number of workers on the worker roster for the station. */
  numberOfWorkers: number;

  // TODO: update this when the route has been fixed
  /** The initials of users on the worker roster. */
  workerInitials: string[];

}
