/**
 * Represents Dashboard stations data.
 */
 export interface DashboardStationResponse {

  /** Number Of Documents this user. */
  numberOfDocuments: number;

  /** Station Name. */
  stationName: string;

  /** Number Of Workers. */
  numberOfWorkers: number;

  /** Worker Initials. */
  workerInitials: Array<string>;

}
