/**
 * Represents information to connect modal data.
 */
export interface ConnectedModalData {
  /** The Document rithmId. */
  documentRithmId: string;

  /** The Station rithmId. */
  stationRithmId: string;

  /** Number of users assigned to document. */
  assignedUser?: number;
}
