import { StationRosterMember } from './station-roster-member';

/**
 * Represents all data to be passed to the modal for displaying documents in a station.
 */
export interface StationList {
  /** The name of the station where documents are being viewed. */
  stationName: string;

  /** The id of the station where documents are being viewed. */
  stationRithmId: string;

  /** Members from station owners. */
  stationOwners: StationRosterMember;

  /** Members from roster owners. */
  rosterUsers: StationRosterMember;
}
