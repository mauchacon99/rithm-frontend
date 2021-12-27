/**
 * Represents the structure to move to documents.
 */

export interface MoveDocument {
  /** From original station id.  */
  fromStationRithmId: string;

  /** Move to stations rithm ids. */
  toStationRithmIds: string[];

  /** Specific id for the document. */
  documentRithmId: string;
}
