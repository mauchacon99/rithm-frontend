import { GlobalPermission } from './global-permission';
import { Group } from './group';
import { ObjectPermission } from './object-permission';

/**
 * Represents all information about a Rithm user.
 */
export interface User {

  /** The global Rithm ID for this user. */
  rithmId: string;

  /** The user's first name. */
  firstName: string;

  /** The user's last name. */
  lastName: string;

  /** The email address registered to the user. */
  email: string;

  /** The profile picture set by the user. */
  profilePic?: string;

  /** The list of flow-level permissions that the user has. */
  objectPermissions: ObjectPermission[];

  /** The global permissions that the user has. */
  globalPermission?: GlobalPermission;

  /** The groups that the user is a member of. */
  groups: Group[];

  /** The date that this user was created. */
  createdDate: string;

  /** The is Assigned property to match worker roster model. */
  isAssigned?: boolean;
}
