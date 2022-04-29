import { StationRosterMember } from './station-roster-member';
/** Represents the data for containers in widget prebuilt. */
export interface ContainerWidgetPreBuilt {
  /**Document rithm id. */
  documentRithmId: string;
  /** Document name. */
  documentName: string;
  /** Station rithmId. */
  stationRithmId: string;
  /** Station name. */
  stationName: string;
  /** Time in station. */
  timeInStation: number;
  /** Station with owners.  */
  stationOwners: StationRosterMember[];
}
