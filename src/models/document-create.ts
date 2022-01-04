/**
 * Interface for document creation.
 */
export interface DocumentCreate {
  /** Station specific id of the station for the document. */
  stationRithmId: string;

  /** Specific name for the document. */
  name?: string;

  /** Specific priority for the document. */
  priority?: number;
}
