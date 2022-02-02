/**
 * Represents all info about a station.
 */
export interface Station {
  /** The global Rithm ID for this station. */
  rithmId: string;

  /** The name of the station. */
  name: string;

  /** Instructions for working in the station. */
  instructions: string;

  /** Allows members of the organization to be part of the list of workers of the current station. */
  allowAllOrgWorkers: boolean;
  
  /** Whether to allow external workers be part of the station owner/worker roster. */
  allowExternalWorkers: boolean;
}
