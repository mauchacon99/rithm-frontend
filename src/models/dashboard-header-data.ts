/**
 * Represents Dashboard header data.
 */
export interface DashboardHeaderResponse {

  /** The Rithm ID for this user. */
  userRithmId?: string;

  /** Number of previously started docs. */
  startedDocuments: number;

  /** Number of stations user is a member of. */
  rosterStations: number;

  /** Dashboard header id. */
  id: number;

}
