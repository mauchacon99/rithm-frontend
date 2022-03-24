import { StationListGroup, StationRosterMember } from '.';

/**
 * Represents all information about station groups.
 */
export interface StationGroupData {
  /** The rithm id of group. */
  rithmId: string;

  /** Title group. */
  title: string;

  /** Sub groups. */
  subStationGroups: StationGroupData[];

  /** List stations of group. */
  stations: StationListGroup[];

  /** List users admins. */
  admins: StationRosterMember[];

  /** List users. */
  users: StationRosterMember[];

  /** Station group is chained or not. */
  isChained: boolean;

  /** Station group is isImplicitRootStationGroup or not. */
  isImplicitRootStationGroup: boolean;
}
