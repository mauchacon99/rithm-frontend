/**
 * Represents all the ways a document is allowed to be generated on a station.
 */
export enum DocumentGenerationStatus {
  /** Documents are not able to be generated at all at this station. */
  None = 'None',

  /** Documents are able to be generated manually by a worker at this station. */
  Manual = 'Manual',

  /** Documents are only able to be generated automatically at this station. */
  Auto = 'Auto',

  /** Documents are able to be generated manually and automatically at this station. */
  Both = 'Both',
}
