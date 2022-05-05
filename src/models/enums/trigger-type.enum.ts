/**
 * Represents all the type of triggers in the powers of a station.
 */
export enum TriggerType {
  /** Flow Manual. */
  ManualFlow = 'manualFlow',

  /** Container Left. */
  DocumentLeft = 'documentLeft',

  /** Check container only on arrival. */
  DocumentArrived = 'documentArrived',

  /** Check all containers on new container arrival. */
  AnyDocumentArrived = 'anyDocumentArrived',

  /** Any Container Left. */
  AnyDocumentLeft = 'anyDocumentLeft',
}
