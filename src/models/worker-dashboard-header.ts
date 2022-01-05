/**
 * Represents data to be displayed in the top header of the worker dashboard.
 *
 * @see `DashboardCount` model in the back end.
 */
export interface WorkerDashboardHeader {
  /** The Rithm ID for the user that requested the dashboard header. */
  userRithmId: string;

  /** The number of previously started documents for the user. */
  startedDocuments: number;

  /** The number of stations where the user is on the work roster. */
  rosterStations: number;
}
