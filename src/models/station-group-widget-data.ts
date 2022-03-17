import { StationListGroupWidget, User } from '.';

/**
 * Represents all information about a Rithm user.
 */
export interface StationGroupWidgetData {
  /** The rithm id of group. */
  rithmId: string;

  /** Title group. */
  title: string;

  /** Sub groups. */
  SubStationGroups: this[];

  /** List stations of group. */
  stations: StationListGroupWidget[];

  /** List users admins. */
  admins: User[];

  /** List users. */
  users: User[];

  /** Station group is chained or not. */
  IsChained: boolean;

  /** Station group is IsImplicitRootFlow or not. */
  IsImplicitRootFlow: boolean;
}
