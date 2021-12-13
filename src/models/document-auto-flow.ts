/**
 * Interface for document auto-flow.
 */
export interface DocumentAutoFlow {
  /** Station specific id of the station for the document. */
  stationRithmId: string;

  /** Specific id for the document. */
  documentRithmId: string;

  /** Test mode for flow. */
  testMode?: boolean;
}
