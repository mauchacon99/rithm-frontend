/**
 * Interface for current station.
 */
export interface DocumentCurrentStation {
  /** The name of event the current station. */
  name: string;

  /** The id the the current station. */
  rithmId: string;

  /** The date of event the current station. */
  flowedTimeUTC: string;
}
