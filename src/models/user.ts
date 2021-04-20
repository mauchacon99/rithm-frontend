import { GlobalPermission } from './global-permission';
import { Group } from './group';
import { ObjectPermission } from './object-permission';

/**
 * Represents all information about a Rithm user.
 */
export interface User {

  /** The user's first name. */
  firstName: string;

  /** The user's last name. */
  lastName: string;

  /** The email address registered to the user. */
  email: string;

  /** The list of flow-level permissions that the user has. */
  objectPermissions: ObjectPermission[];

  /** The global permissions that the user has. */
  globalPermission: GlobalPermission;

  /** The groups that the user is a member of. */
  groups: Group[];

  /** The date that this user was created. */
  createdDate: string;
}
