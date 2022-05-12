/**
 * Represents all data of the stations.
 */
export interface StationOptimized {
  /** The id of the station where documents are being viewed. */
  rithmId: string;

  /** The name of the station where documents are being viewed. */
  name: string;

  /** The instructions for the stations. */
  instructions: string;

  /** Number of days of creation. */
  dueDate?: string;

  /** User who created the station. */
  createdByRithmId: string;

  /** Date the station was created. */
  createdDateUTC: string;

  /** User who updated the station. */
  updatedByRithmId: string;

  /** Date the station was updated. */
  updatedDateUTC: string;

  /** The id of the organization that this station group belongs to. */
  organizationRithmId?: string;

  /** Indicates whether the station is archived. */
  archived: boolean;

  /** The priority of the station. */
  priority: number;

  /** The coordinates for the location the station on the x-axis. */
  locationX: number;

  /** The coordinates for the location the station on the y-axis. */
  locationY: number;

  /** Station document generation status. */
  documentGeneratorStatus: number;

  /** Whether to allow workers to rename documents. */
  workerCanRenameDocuments?: boolean;

  /** Optional notes to station. */
  notes?: string | null;

  /** Station group is chained or not. */
  isChained: boolean;

  /** Whether to allow external workers be part of the station owner/worker roster. */
  allowExternalWorkers: boolean;

  /** Allows members of the organization to be part of the list of workers of the current station. */
  allowAllOrgWorkers: boolean;

  /** A boolean that is optional. */
  altStationButtons?: boolean;

  /** Whether to allow previous button be part of the document/station. */
  allowPreviousButton: boolean;

  /** Customize the name of the flow button. */
  flowButton: string;
}
