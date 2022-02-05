/**
 * Represents all data to be passed to the modal for displaying documents in a station.
 */
export interface StationDocumentsModalData {
  /** The name of the station where documents are being viewed. */
  stationName: string;

  /** The id of the station where documents are being viewed. */
  stationId: string;
}
