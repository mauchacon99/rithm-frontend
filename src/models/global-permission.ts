import { Permission } from './permission';

/**
 * Represents a set of global permissions for a user or group.
 */
export interface GlobalPermission {

  /** The set of permissions to be applied globally. */
  permission: Permission;

  // TODO: Update permission models to match back end
}
