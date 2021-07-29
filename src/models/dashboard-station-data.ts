import { WorkerRosterResponse } from './worker-roster-response';

/**
 * Represents Dashboard stations data.
 */
 export interface DashboardStationData {

  /** The global Rithm id for the station. */
  rithmId?: string;

  /** Number Of Documents this user. */
  numberOfDocuments: number;

  /** Station Name. */
  stationName: string;

  /** Number Of Workers. */
  numberOfWorkers: number;

  /** Worker Initials. */
  workerInitials: Array<WorkerRosterResponse>;

}
