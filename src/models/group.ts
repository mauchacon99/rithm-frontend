import { GlobalPermission } from './global-permission';
import { ObjectPermission } from './object-permission';
import { User } from './user';

/**
 * Represents info about a group of users used for permissions.
 */
export interface Group {

  /** The global Rithm ID for this group. */
  rithmId: string;

  /** The name given to the group. */
  name: string;

  /** The list of members of the group. */
  users: User[];

  /** The global permissions granted to the group. */
  globalPermission: GlobalPermission;

  /** The object-specific permissions granted to the group. */
  objectPermissions: ObjectPermission[];
}
